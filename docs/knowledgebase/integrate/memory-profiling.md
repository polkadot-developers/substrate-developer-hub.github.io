# Memory profiling utilizing Substrate

This implementation uses the linux system profile, utilizing memory allocations of Substrate & Polkadot.

## Understanding Modes

## Installing memory-profiler

We recommend [koute's memory profiler](https://github.com/koute/memory-profiler).
This assumes you have installed and running rust stable, GCC and YARN globally. Please refer to their documentation if you are unsure. 

[The following steps will build a memory profiler](https://github.com/koute/memory-profiler#building):

1. clone the repository
2. compile the library and the cli

```bash
git clone https://github.com/koute/memory-profiler
cd memory-profiler
cargo build --release -p memory-profiler # builds the library
cargo build --release -p memory-profiler-cli # builds the cli

```

## Using the profiler on substrate

Build substrate/polkadot in release mode in your terminal `cargo build --release`. After the command is completed, run the build binary with the memory profiler preloaded. This step assumes the memory-profiler directory is next to the substrate directory and will only function if the directory is correctly called and placed:
```
LD_PRELOAD=../memory-profiler/target/release/libmemory_profiler.so ./target/release/substrate
```

You can pass cli arguments in substrate as usual, you can [configure the memory profiler via environment variables](https://github.com/koute/memory-profiler#environment-variables-used-by-libmemory_profilerso.

This will create a `.dat` file in the directory which you defined and maintain the traces for analysing. 
Additionally, you can utilize the memory-profiler server to do the same thing using a web ui. 
To execute this, place the memory-profiler in a directory as follows:

```
../memory-profiler/target/release/memory-profiler-cli server *.dat

```

This will analyse the file. On standard hardware this takes approximately a minute per gigabyte of data. Substrate creates about 1.6Gb/hour runtime during normal operation and more during initial sync or compile. Once it is done, it will provide you with a URL. This is where you will inspect the data at (the deduplication warnings can be ignored):

```
[2020-05-06T08:57:09Z WARN  cli_core::loader] Duplicate allocation of 0x00007F58BC20CA90; old backtrace = BacktraceId(21363), new backtrace = BacktraceId(19194)
[2020-05-06T08:57:09Z WARN  cli_core::loader] Duplicate allocation of 0x00007F5864230040; old backtrace = BacktraceId(21321), new backtrace = BacktraceId(21321)
[2020-05-06T08:57:09Z WARN  cli_core::loader] Duplicate allocation of 0x00007F5864202D70; old backtrace = BacktraceId(21322), new backtrace = BacktraceId(21322)
[2020-05-06T08:59:20Z INFO  cli_core::loader] Loaded data in 315s 820
[2020-05-06T08:59:20Z INFO  actix_server::builder] Starting 8 workers
[2020-05-06T08:59:20Z INFO  actix_server::builder] Starting server on 127.0.0.1:8080
```

Now open your browser and point it to the URL (here `http://localhost:8080/`), select the session you want to investigate. This will propagate a graph and may need a few minutes to load if a lot of data is being parsed.

![Graphs from the web UI](https://i.imgur.com/PzwjJdV.png)


Via the top [via the REST API](https://github.com/koute/memory-profiler#rest-api-exposed-by-memory-profiler-cli-server) you can also download other versions of the data and analyze it with a secondary tool.

### Heaptrack

The heaptrack file and heaptrack_gui can be used to investigate specific calls and stack traces suspected to leaking memory:

### Tips & Tricks

With the profiler generating huge logs, especially when Substrate has been running for a while, the analyzer might itself run out of memory during the process and segfaults. To circumvent this, create smaller logs by toggling the memory profiler with the `USR1`-Signal. Whenever this call is sent, it restarts creating a new log file. A simpler way to have the tracing split in half-an-hour-chunks – around ~800MB each – is to use `watch`: `PID=12345 watch -n 1800 'kill -USR1 $PID && sleep 1 && kill -USR1 $PID'`.

## Known issues

(FIXME: report these!)


- the memory profiler currently core dumps when running substrate with `--wasm-execution compiled`
- clicking on `flamegraph` makes the server crash
