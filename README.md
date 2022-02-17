
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
1. Inputs (mutations) can only contain arrays of size 1. Example
```
    posts: [{ _id: 2, value: 'too' }]
    posts: [{ _id: 4, mentions: [{ text: 'banana' }] }]
    posts: [{ _id: 7, _delete: true }]
```
2. Original document expected must be for only one content creator because the expected output does
not take into consideration multiple content creators
3. Operations in single statements must be unique because the output keys only contain objects
```
    // Valid
    {
        posts: [
            { _id: 2, value: 'too' },
            { _id: 4, mentions: [{ text: 'banana' }] },
            { _id: 7, _delete: true }
        ]
    }

    // Invalid
    {
        posts: [
            { _id: 2, mentions: [{ text: 'kiwi' }] },
            { _id: 4, mentions: [{ text: 'banana' }] },
            { _id: 7, _delete: true }
        ]
    }
```
