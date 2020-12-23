# Map Colonies catalog upload service

This is Api service for uploading new data to map colonies catalog.

### usage:

1. run `npm install `.
1. run `npm run copySchema:dev` to copy the models schemas from the mc-model-types package to project directory (required for local execution).
1. run `npm run confd` to generate configuration file.
1. (optional) add `.env` file to change server port and swagger host name (see `.env.example`).
1. use npm run start to run the server locally. 

### development notes:

1. when importing external dependencies from DI (such as McLogger) in class constructor the following decorator must be used to retrieve instance:

```typescript
@inject(delay(() => <injection token>)) <variable definition>
```

usage example:

```typescript
public constructor(
    @inject(delay(() => MCLogger)) private readonly logger: MCLogger) {
  }
```
