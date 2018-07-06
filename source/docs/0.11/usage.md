title: Usage
---

# Create your first microservice
This example shows you how to create a small service with a `math` service which is able to add two numbers.

```js
const { ServiceBroker } = require("moleculer");

let broker = new ServiceBroker({ logger: console });

broker.createService({
    name: "math",
    actions: {
        add(ctx) {
            return Number(ctx.params.a) + Number(ctx.params.b);
        }
    }
});

broker.start()
    // Call service
    .then(() => broker.call("math.add", { a: 5, b: 3 }))
    .then(res => console.log("5 + 3 =", res))
    .catch(err => console.error(`Error occured! ${err.message}`));
```

{% note info Try it in your browser! %}
Open this example on [Runkit!](https://runkit.com/icebob/moleculer-usage)
{% endnote %}

# Create a Moleculer project
Use the [Moleculer CLI tool](moleculer-cli.html) to create a new Moleculer-based microservices project.

1. Install `moleculer-cli` globally
    ```bash
    $ npm install moleculer-cli -g
    ```
2. Create a new project (named `first-demo`)
    ```bash
    $ moleculer init project-simple first-demo
    ```
    > Press Y to all questions
    
3. Open project folder
    ```bash
    $ cd first-demo
    ```
    
4. Start project
    ```bash
    $ npm run dev
    ```
5. Open the [http://localhost:3000/greeter/hello](http://localhost:3000/greeter/hello) link in your browser. It calls the `hello` action of `greeter` service via [API gateway](https://github.com/moleculerjs/moleculer-web) and returns with the result.

{% note info Congratulations! %}
You have just created your first Moleculer-based microservices project! The next step is to check our [examples](examples.html) or [demo projects](https://github.com/moleculerjs/moleculer-examples).
{% endnote %}


