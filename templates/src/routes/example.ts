export default [
    {
        path: "/",
        method: "get",
        middlewares: [],
        controller: "example",
        action: "get",
        socket:{
            event_name: "example",
        }
    },
]