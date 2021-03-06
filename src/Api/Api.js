import { ApolloClient, createHttpLink, InMemoryCache, gql } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

// method where the conection to the GraphQL API is created
export const getData = async (topicName) => {
    const httpLink = createHttpLink({
        uri: process.env.REACT_APP_GITHUB_URL,
    });

    const authLink = setContext((_, { headers }) => ({
        headers: {
            ...headers,
            authorization: `Bearer ${process.env.REACT_APP_GITHUB_ACCESS_TOKEN}`,
            }
        })
    );

    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    });

    const { data } = await client.query({
        query: gql`
        {
            topic(name: "${topicName}") {
                id
                name
                relatedTopics(first: 10){
                name
                id
                stargazerCount
                }
            }
        }
        `
    });
    return data.topic
}
