import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import graphql from 'graphql';
import cors from 'cors';
import bodyParser from 'body-parser';
const QueryRoot = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    hello: {
      type: graphql.GraphQLString,
      resolve: () => "Hello world!"
    }
  })
})

const schema = new graphql.GraphQLSchema({ query: QueryRoot });

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/api');
})


