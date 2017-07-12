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
Invoke the tool with two paths to Swagger/OpenAPI files in order to find differences between them, these paths can either be paths to the specs in the local filesystem or URLs to the specs. 
The Open API specs should be in JSON format.
```
openapi-diff /path/to/old/openapi.json /path/to/new/openapi.json 
```

The tool's output will display amount and type of changes (breaking, non-breaking, unclassified), and then list the changes with the relevant info.

## Feature support

### Supported
- Specs in the local filesystem or as URLs
- Editions to the Info object and ^x- properties at the top level of the spec.

### Beta support 
- Additions and deletions to the Info object and ^x- properties at the top level of the spec.

### Not supported
- Any other additions, editions or deletions to the spec.
- Specs in YML format