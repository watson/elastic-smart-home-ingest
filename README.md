# Elastic Smart Home Ingest

Ingest data from your smart home devices into Elasticsearch.

## Limitations

Currently only an Elasticsearch instance hosted on [Elastic Cloud](https://www.elastic.co/cloud) is supported.

Currently only the following smart home manufacturers are supported:

- [Netatmo Weather Station](https://www.netatmo.com/weather/weatherstation)

## Installation

Install module globally:

```sh
npm install elastic-smart-home-ingest -g
```

## Usage

```sh
elastic-smart-home-ingest [options]
```

When you run `elastic-smart-home-ingest` the first time, you'll be guided through the setup process.

### Options

- `--help` / `-h`: Output command line help
- `--version` / `-v`: Output package version
- `--yes` / `-y`: Don't query for already configured options (useful for non-interactive mode)
- `--poll`: Continuously poll for new data
- `--show-env`: List all supported environment variables

By default, running `elastic-smart-home-ingest` will ingest all historical data and exist once it's done indexing.
You can re-run this command at any time and it will only ingest new data not already ingested.
If you enable polling mode (`--poll`), the tool will not exist, but will instead continuously poll for new data.

### Environment Variables

It's also possible to configure `elastic-smart-home-ingest` using environment variables.
Environment variables takes precedence over stored configuraiton.
To get a list of all supported environment variables, run with the `--show-env` flag.

## License

MIT