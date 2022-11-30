# Elastic Smart Home Ingest

Ingest data from your smart home devices into Elasticsearch.

## Limitations

Currently only an Elasticsearch instance hosted on [Elastic Cloud](https://www.elastic.co/cloud) is supported.

Currently only the following smart home manufacturers are supported:

-  [Netatmo Weather Station](https://www.netatmo.com/weather/weatherstation)

## Installation

Install module globally:

```sh
npm install elastic-smart-home-ingest -g
```

## Usage

```sh
elastic-smart-home-ingest [options]
```

### Options

- `--help` / `-h`: Output command line help
- `--version` / `-v`: Output pacakge version
- `--yes` / `-y`: Don't query for already configured options
- `--poll`: Continuously poll for new data

By default, running `elastic-smart-home-ingest` will igenst all historical data and exist once it's done indexing.
You can re-run this command at any time and it will only ingest new data not already ingested.
If you enable polling mode (`--poll`), the tool will not exist, but will instead continuously poll for new data.

## Config

Use environment variables to configure this tool or create an `.env` file in the root directory with one environment variable per line.

### Required

- `ES_CLOUD_ID` - Get the Elastic Cloud ID by signing up for [Elastic Cloud](https://www.elastic.co/cloud) and creating a new instance
- `ES_API_KEY` - Create an API key in Kibana
- `NETATMO_CLIENT_ID` - Get the Netatmo Client ID by [creating a new Netatmo app](https://dev.netatmo.com/apps/)
- `NETATMO_CLIENT_SECRET` - Get the Netatmo Client Secret from the same app created in the step above
- `NETATMO_USERNAME` - Your regular Netatmo username
- `NETATMO_PASSWORD` - Your regular Netatmo password

### Optional

- `ES_NETATMO_MEASUREMENTS_INDEX` - The Elasticsearch index into which Netatmo measurements are indexed (default: `netatmo-measurements`)

## License

MIT