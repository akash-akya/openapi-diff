# Swagger 2 / OpenAPI 3 feature support

This is a list of all the Swagger 2 / OpenAPI 3 objects and properties supported by OpenAPI-diff. If something is not on the list, it's not suported (yet).

## Swagger 2

| Field | Supported | Notes |
|---|---|---|
| swagger | yes | |
| info | partial | Editions to the info object are fully supported, additions and deletions will be detected and left unclassified (to be fully supported soon) |
| host | yes | |
| basePath | yes | |
| schemes | yes | Reordering the schemes array but preserving the same values is understood as a non-change and won't be reported by the tool |
| ^x- | partial | Editions to x-properties at the top level are fully supported, additions and deletions will be detected and left unclassified (to be fully supported soon) |

## OpenAPI 3.0.0

| Field | Supported | Notes |
|---|---|---|
| openapi | yes | |
| info | partial | Editions to the info object are fully supported, additions and deletions will be detected and left unclassified (to be fully supported soon) |
| ^x- | partial | Editions to x-properties at the top level are fully supported, additions and deletions will be detected and left unclassified (to be fully supported soon) |
