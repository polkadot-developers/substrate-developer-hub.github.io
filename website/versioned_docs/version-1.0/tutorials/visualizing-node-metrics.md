---
title: "Visualizing Node Metrics"
id: version-1.0-visualizing-node-metrics
original_id: visualizing-node-metrics
---

Recent versions of Substrate record metrics, such as how many peers your node
is connected to, how much memory your node is using, etc. To visualize these
metrics, you can use a tool called [Grafana](https://grafana.com/).

## Step 1: Install and run Grafana

If you're on
macOS, the easiest way to do that is via [Homebrew](https://brew.sh/):

```bash
brew install grafana
```

Grafana runs via a server, which you can run via `brew` with:

```bash
brew services start grafana
```

Downloads for other platforms are available [here](https://grafana.com/grafana/download).

## Step 2: Install the Grafana JSON DataSource plugin:

We use a simple JSON interface to serve metrics. The
[Grafana JSON DataSource](https://github.com/simPod/grafana-json-datasource) plugin can be
installed with:

```bash
 grafana-cli plugins install simpod-json-datasource
```

## Step 3: Run your node

As long as you're running a version of Substrate at or after commit
[`d9ca975`](https://github.com/paritytech/substrate/commit/d9ca9750dba018463d59459a3ee1c03b71ea2d46),
a server serving metrics for Grafana will start on port `9955`. You can specify
this port with `--grafana-port <PORT>` and enable it to be accessed over a
network with `--grafana-external`.

## Step 4: Set Up Grafana

We will not cover setting up and running Grafana in great detail - there's the
[Getting Started guide](https://grafana.com/docs/guides/getting_started/) for
that. Here are a few pointers though:

1. On the 'Add data source' screen, select the JSON data source in the
'Others' section.
2. Set the url of the running servers (e.g.
`http://localhost:9955`)
    > NOTE: just `locahost::<PORT>` won't work.
3. Click `Save & Test`.

Grafana should ping the server and show that the data source is working:

![Data Source Config](/docs/assets/tutorials/grafana/datasource-config.png)

Creating queries is a lot simpler than in other data sources. Simply click the
drop-down and select the metric you want to visualize:

![Creating a query](/docs/assets/tutorials/grafana/metric-selection.png)

## Step 5: Create Your Dashboard

Once you've done all that, you should be able to make a pretty neat node
dashboard!

![Node Dashboard](/docs/assets/tutorials/grafana/dashboard.png)

There's a lot of work still to be done on the metrics system. Hopefully, in the
future you'll be able to log metrics from anywhere in the node runtime to a
variety of databases, such as [Prometheus](https://prometheus.io/).

If you have any suggestions, feel free to file an issue on
[the substrate repository](https://github.com/paritytech/substrate).

## Next Steps

### Learn More

- Learn how to [set up a private Substrate network](start-a-private-network).

### Examples

- Take a look at the Grafana dashboard configuration for the [Polkadot network](https://github.com/w3f/polkadot-dashboard).

### References

<!-- TODO: Update this to RUSTDOC link-->

- Visit the source code for [grafana-data-source](https://github.com/paritytech/substrate/tree/master/client/grafana-data-source).

