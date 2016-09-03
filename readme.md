## Synopsis

This library helps you create more functional table easily.

## Precautions

Some parts in this project relies on twitter bootstrap and jquery. Please include that in your page.

## Sample

![sample](https://github.com/heruujoko/crudtable/blob/master/sample.gif)

Fiddle : ![fiddle](https://jsfiddle.net/heruujoko/vj7ds7um/)
Note: the fiddle is just to show how to set up the HTML tags and may not have the full table functionality since I can't provide an API to serve the table.

## Installation

Include [crudtable.js](https://github.com/heruujoko/crudtable/blob/master/dist/crudtable.js) to your page, and just wrap it inside a div with id "crudsection"

```html
<div id="crudsection">
  <crud-table endpoint="link_to_your_api_endpoint" columns="your_column_json_spec"></crud-table>
</div>  
```

## Column JSON Spec Sample

```json
[
  { "label": "name" , "type":"text", "required": true},
  { "label": "email" , "type":"email", "required": true},
  { "label": "password" , "type":"password", "required": true},
  { "label": "description" , "type":"textarea", "required": true},
]
```    

Supported form type :

1. text
2. textarea
3. email
4. password

## API endpoint

This library assumes your API has common resources structures and match the JSON Spec for the forms

1. GET http://your_endpoint/
```json
  [
    {
      "name": "name",
      "email": "email",
      "password": "password",
      "description": "description"
    },
    {
      "name": "name",
      "email": "email",
      "password": "password",
      "description": "description"
    }
  ]
```
2. GET http://your_endpoint/{id}
```json
    {
      "name": "name",
      "email": "email",
      "password": "password",
      "description": "description"
    }
```
2. POST http://your_endpoint/
3. PUT http://your_endpoint/{id}
```json
    {
      "name": "name",
      "email": "email",
      "password": "password",
      "description": "description"
    }
```
4. DELETE http://your_endpoint/{id}

## What's Next

Add select , multiselect and file options for forms.

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.
