# OpenAPI Diff
> A CLI tool to identify differences between Swagger/OpenAPI specs.

## Requirements
- NodeJS 4.x or higher (tested using 4.x, 6.x and 8.x)
- NPM 2.x or higher (tested using 2.x, 3.x and 5x)

## Installation

Install the tool using NPM:
```
npm install --global openapi-diff
```

## Usage
Invoke the tool with two paths to Swagger/OpenAPI files in order to find differences between them, these paths can either be paths to the specs in the local filesystem or URLs to the specs (sorry, no YML support just yet). 
The Open API specs should be in JSON format.
```
openapi-diff /path/to/old/openapi.json /path/to/new/openapi.json 
```

The tool's output will display the amount and type of changes, and then list the changes with the relevant info. Changes are classified as follows:

* Breaking: changes that would make existing consumers incompatible with the API (deletion of paths, adding required properties...)
* Non-breaking: changes that would **not** make existing consumers incompatible with the API (addition of paths, turning a required property into optional...)
* Unclassified: changes that have been detected by the tool but can't be classified (modifications to X-Properties and other unforeseen changes)

The command will exit with an exit code 1 if any breaking changes were found, so that you can fail builds in CI when this happens.

## Feature support
See [SPEC_SUPPORT.md](SPEC_SUPPORT.md)
