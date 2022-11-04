// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    app:{
        head:{
            charset:"utf-16",
            title:"pripo",
            meta:[
                {
                    name:"description",
                    content: "App where you can post anything you want"
                },
                {
                    property:"og:title",
                    content:"pripo"
                },
                {
                    property:"og:description",
                    content: "App where you can post anything you want"
                }
            ],
            link:[
                {
                    rel:"icon",
                    href: "icon.svg"
                }
            ]
        }
    },
    css:[
        "postcss",
        "assets/main.css"
    ],
    modules:[
        '@pinia/nuxt'
    ]
})
