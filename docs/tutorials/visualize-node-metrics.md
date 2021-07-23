---
title: "Visualizing Node Metrics"
---

Recent versions of Substrate expose metrics, such as how many peers your node is
connected to, how much memory your node is using, etc. To visualize these
metrics, you can use tools like [Prometheus](https://prometheus.io/) and
[Grafana](https://grafana.com/).

> Note: In the past Substrate exposed a Grafana JSON endpoint directly. This has
> been replaced with a Prometheus metric endpoint.

A possible architecture could look like:

```
+-----------+                     +-------------+                                                              +---------+
| Substrate |                     | Prometheus  |                                                              | Grafana |
+-----------+                     +-------------+                                                              +---------+
      |               -----------------\ |                                                                          |
      |               | Every 1 minute |-|                                                                          |
      |               |----------------| |                                                                          |
      |                                  |                                                                          |
      |        GET current metric values |                                                                          |
      |<---------------------------------|                                                                          |
      |                                  |                                                                          |
      | `substrate_peers_count 5`        |                                                                          |
      |--------------------------------->|                                                                          |
      |                                  | --------------------------------------------------------------------\    |
      |                                  |-| Save metric value with corresponding time stamp in local database |    |
      |                                  | |-------------------------------------------------------------------|    |
      |                                  |                                         -------------------------------\ |
      |                                  |                                         | Every time user opens graphs |-|
      |                                  |                                         |------------------------------| |
      |                                  |                                                                          |
      |                                  |       GET values of metric `substrate_peers_count` from time-X to time-Y |
      |                                  |<-------------------------------------------------------------------------|
      |                                  |                                                                          |
      |                                  | `substrate_peers_count (1582023828, 5), (1582023847, 4) [...]`           |
      |                                  |------------------------------------------------------------------------->|
      |                                  |                                                                          |

```

<details>
 <summary>Reproduce diagram</summary>

Go to: https://textart.io/sequence

```
object Substrate Prometheus Grafana
note left of Prometheus: Every 1 minute
Prometheus->Substrate: GET current metric values
Substrate->Prometheus: `substrate_peers_count 5`
note right of Prometheus: Save metric value with corresponding time stamp in local database
note left of Grafana: Every time user opens graphs
Grafana->Prometheus: GET values of metric `substrate_peers_count` from time-X to time-Y
Prometheus->Grafana: `substrate_peers_count (1582023828, 5), (1582023847, 4) [...]`
```

</details>

## Install Prometheus and Grafana

1. Install Prometheus [here](https://prometheus.io/docs/prometheus/latest/installation/)
2. Install Grafana [here](https://grafana.com/get)

> Note: we suggest for _testing_ that you download the compiled `bin` programs for these apps
> as apposed to fully installing them or using them in docker. Just `download` for your
> architecture, and run it from the `working directory` that is convenient for you.
> The links above provide instruction on this, and this guide assume you do it this way.

## Start a Substrate Template Node

> Before you continue here, you should complete the
[create your first substrate chain](create-your-first-substrate-chain/index.md)
tutorial. The same substrate version, conventions for
directory structure, and bin names are used here.
You can of course use your own custom substrate node instead of the template,
just edit the commands shown as needed.

Substrate exposes an endpoint which serves metrics in the [Prometheus exposition
format](https://prometheus.io/docs/concepts/data_model/) available on port
`9615`. You can change the port with `--prometheus-port <PORT>` and enable it to
be accessed over an interface other than local host with
`--prometheus-external`.

```bash
# clear the dev database
./target/release/node-template purge-chain --dev -y
# start the template node  in dev & tmp mode to experiment
# optionally add the `--prometheus-port <PORT>`
# or `--prometheus-external` flags
./target/release/node-template --dev --tmp
```

## Configure Prometheus to scrape your Substrate node

In the working directory where you installed Prometheus, you will find a `prometheus.yml` configuration file.
Let's modify this (or create a custom new on) to configure Prometheus to scrape the exposed endpoint by adding
it to the targets array. If you modify the default, here is what will be different:

```yml
# --snip--

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "substrate_node"

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    # Override the global default and scrape targets from this job every 5 seconds.
    # ** NOTE: you want to have this *LESS THAN* the block time in order to ensure
    # ** that you have a data point for every block!
    scrape_interval: 5s

    static_configs:
      - targets: ["localhost:9615"]
```

> **NOTE:** you want to have `scrape_interval` _less than_ the block time
> in order to ensure that you have a data point for every block!

Now we can start a Prometheus instance with the prometheus.yml config file. Presuming you downloaded the binary,
`cd` into the install directory and run:

```bash
# specify a custom config file instead if you made one here:
./prometheus --config.file prometheus.yml
```

leave this process running.

## Check All Prometheus Metrics

In a new terminal, we can do a quick status check on prometheus:

```bash
curl localhost:9615/metrics
```

Which should return a similar output to:

```bash
# HELP substrate_block_height Block height info of the chain
# TYPE substrate_block_height gauge
substrate_block_height{status="best"} 7
substrate_block_height{status="finalized"} 4
# HELP substrate_build_info A metric with a constant '1' value labeled by name, version
# TYPE substrate_build_info gauge
substrate_build_info{name="available-vacation-6791",version="2.0.0-4d97032-x86_64-linux-gnu"} 1
# HELP substrate_database_cache_bytes RocksDB cache size in bytes
# TYPE substrate_database_cache_bytes gauge
substrate_database_cache_bytes 0
# HELP substrate_finality_grandpa_precommits_total Total number of GRANDPA precommits cast locally.
# TYPE substrate_finality_grandpa_precommits_total counter
substrate_finality_grandpa_precommits_total 31
# HELP substrate_finality_grandpa_prevotes_total Total number of GRANDPA prevotes cast locally.
# TYPE substrate_finality_grandpa_prevotes_total counter
substrate_finality_grandpa_prevotes_total 31
#
# --snip--
#
```

Alternatively in a browser open that same URL (http://localhost:9615/metrics) to view
all available metric data.

> NOTE: here you can see the `HELP` fields for each metric that is exposed for monitoring via grafana.

## Visualizing Prometheus Metrics with Grafana

Once you have Grafana running, navigate to it in a browser (**the default is https://localhost:3000/**).
Log in (default user `admin` and password `admin`) and navigate to the [data sources](http://localhost:3000/datasources) page.

You then need to select a `Prometheus` data source type and specify where Grafana needs to look for it.

> Note: The Prometheus port Grafana needs is NOT the one you set in the `prometheus.yml` file (https://localhost:9615) for where your node is publishing it's data.

With your substrate node and Prometheus are running, configure Grafana to look for Prometheus
on it's default port: https://localhost:9090 (unless you customized it).

Hit `Save & Test` to ensure that you have the data source set correctly. Now you can configure a new dashboard!

### Template Grafana Dashboard

If you would like a basic dashboard to start [here is a template example](assets/tutorials/visualize-node-metrics/Substrate-Node-Template-Metrics.json) that you can `Import` in Grafana to get basic information about your node:

<br>
<center><img src="/docs/assets/tutorials/visualize-node-metrics/grafana.png" alt="grafana dashboard" width="50%"/></center>
<br>

If you create your own, the [prometheus docs for grafana](https://prometheus.io/docs/visualization/grafana/)
may be helpful.

<b>If you do create one, consider uploading it to the
[community list of dashboards](https://grafana.com/grafana/dashboards) and letting
the substrate builder community know it exists by listing in on
[Awesome Substrate](https://github.com/substrate-developer-hub/awesome-substrate)!
Here is ours on [the grafana public dashboards](https://grafana.com/grafana/dashboards/13759/)</b>

## Next Steps

### Learn More

- Learn how to [set up a private Substrate network](../../tutorials/start-a-private-network/).
- Further configuration, notification services, and permanent installation of
  [Substrate/Polkadot monitoring tools](https://wiki.polkadot.network/docs/en/maintain-guides-how-to-monitor-your-node)

### Examples

- The Grafana dashboard configuration for the [Polkadot
  network](https://github.com/w3f/polkadot-dashboard).
- [Grafana Template](https://grafana.com/grafana/dashboards/13759/) for a Substrate Node Template

### References

<!-- TODO: Update this to RUSTDOC link-->

- Visit the source code for
  [Substrate Prometheus Exporter](https://github.com/paritytech/substrate/tree/master/utils/prometheus).
- See the [docs for prometheus in substrate](https://substrate.dev/rustdocs/latest/prometheus/index.html).
