
# ASPIRE IQ - SUBDOCUMENT ARRAY MUTATION

## Overview
AspireIQ uses a document database (amongst other storage solutions) to store high
volume application data. Often, the application needs to manage an array of objects (i.e.
posts, mentions) which get stored as properties of a root JSON document. For
example, a content creator on the AspireIQ platform can be responsible for producing
social posts as part of their relationship with the brands.

The document database supports the following operations for subdocument arrays:
1. **$add**: adding new subdocument to the end of an array
2. **$remove**: removing specific subdocuments by index (zero-based)
3. **$update**: updating specific subdocuments by index (zero-based)

This repository contains a generic routine named **generateUpdateStatement** that accepts as input
the **original document**, a **mutation** describing the operation to execute (add/update/remove)
and outputs the operation statement that occurred.

## Run Application
1. Clone the repository
2. Install dependencies
```
    $ yarn install // or npm install
```
3. (Optional) Run tests to see result of possible edge cases
```
    $ yarn test // or npm run test
```
4. Start the server. The server runs on port 5000 or whatever port is configured in the `.env` file
```
    $ yarn dev // or npm run dev
```
5. In a client such as Insomnia, Postman or using curl, make a POST request to `http:localhost:5000/api/array-mutation`.
Sample data in the request body
```
    {
        "document": {
            "_id": 1,
            "name": "Johnny Content Creator",
            "posts": [
                {
                    "_id": 2,
                    "value": "one",
                    "mentions": []
                },
                {
                    "_id": 3,
                    "value": "two",
                    "mentions": [
                        {
                            "_id": 5,
                            "text": "apple"
                        },
                        {
                            "_id": 6,
                            "text": "orange"
                        }
                    ]
                },
                {
                    "_id": 4,
                    "value": "three",
                    "mentions": []
                },
                {
                    "_id": 7,
                    "value": "four",
                    "mentions": [
                        {
                            "_id": 8,
                            "text": "plum"
                        },
                        {
                            "_id": 9,
                            "text": "avocado"
                        },
                        {
                            "_id": 10,
                            "text": "grapes"
                        }
                    ]
                }
            ]
        },
        "mutation": {
            "posts": [
                { "_id": 2, "value": "too" }
            ]
        }
    }
```
Sample response
```
    {
        "$update": {
            "posts.0.value": "too"
        }
    }
```
Indicating that an update operation was made to the `value` key of the first index of the `posts`.

## Assumptions
1. If one operation type is requested, the resulting output will be an object, e.g.
```
    {
        "$update": {"posts.0.value": "too"},
        "$add": {"posts": [{"value": "four"}] },
        "$remove" : {"posts.2" : true}
    }
```
2. If more than one operation type is request, e.g. multiple additions, the resulting output will
be an array.
```
    {
        $update: { 'posts.3.mentions.1.likes.1.up': 5 },
        $remove: { 'posts.3.mentions.1.likes.0': true },
        $add: [
            { 'posts.1.mentions.0.likes': [{ up: 10 }] },
            { 'posts.1.mentions.1.likes': [{ up: 15 }] },
            { 'posts.3.mentions.0.likes': [{ up: 24 }] },
        ]
    }
```
