import { defineStore } from "pinia";

export const usePripoStore = defineStore("pripo", {
  state: () => ({
    currentTitle: "pripo",
    blogs: [
      {
        id: 1,
        user: "Jatin Thakur",
        userPfp: "/mypfp.jpg",
        tags: ["Cooking", "Hotels"],
        title: "What is a Michelin Star and How Do You Get One?",
        content: `Michelin star is the ultimate hallmark of culinary excellence. Michelin stars are awarded to restaurants judged to be of a particularly high standard. Eateries that make the grade can be awarded one, two, or three stars, and the accolade is much-coveted by chefs around the world. The star system was first introduced in 1926, with a single star denoting “a very good restaurant”. The second and third stars were added in 1933, with two stars meaning "excellent cooking that is worth a detour", and three stars "exceptional cuisine that is worth a special journey".The Michelin Guide has been published annually since 1900 and was originally intended to help drivers find mechanics, hotels, and of course, good restaurants, on their travels.
In the years that followed, the popularity of the scheme spread overseas, with guides published for major cities around the world. The company also enlisted the help of the legendary Michelin Inspectors, and developed the rigorous system of testing that has made the Michelin Guide the fine-dining bible it is today.`,
        isPublic: true,
        date_posted: "yesterday",
        comment: [
          {
            userPfp: "/anya.jpg",
            username: "cryogon",
            content: "Nice Story Dude",
            postedOn: "Sun Nov 05 2022 22:50:25 GMT+0530 (India Standard Time)",
          },
        ],
      },
      {
        id: 2,
        user: "Jay Thakur",
        userPfp: "/mypfp.jpg",
        tags: ["Computing", "Network"],
        title:
          "What is a DNS server and How  do DNS servers resolve a DNS query?",
        content: `The Domain Name System (DNS) is the phonebook of the Internet. When users type domain names such as ‘google.com’ or ‘nytimes.com’ into web browsers, DNS is responsible for finding the correct IP address for those sites. Browsers then use those addresses to communicate with origin servers or CDN edge servers to access website information. This all happens thanks to DNS servers: machines dedicated to answering DNS queries.
In a typical DNS query without any caching, there are four servers that work together to deliver an IP address to the client: recursive resolvers, root nameservers, TLD nameservers, and authoritative nameservers.
The DNS recursor (also referred to as the DNS resolver) is a server that receives the query from the DNS client, and then interacts with other DNS servers to hunt down the correct IP. Once the resolver receives the request from the client, the resolver then actually behaves as a client itself, querying the other three types of DNS servers in search of the right IP.
First the resolver queries the root nameserver. The root server is the first step in translating (resolving) human-readable domain names into IP addresses. The root server then responds to the resolver with the address of a top-level domain (TLD) DNS server (such as .com or .net) that stores the information for its domains.
Next the resolver queries the TLD server. The TLD server responds with the IP address of the domain’s authoritative nameserver. The recursor then queries the authoritative nameserver, which will respond with the IP address of the origin server.
The resolver will finally pass the origin server IP address back to the client. Using this IP address, the client can then initiate a query directly to the origin server, and the origin server will respond by sending website data that can be interpreted and displayed by the web browser.`,
        isPublic: false,
        date_posted: "2 days ago",
      },
      {
        id: 3,
        user: "Aditya Thakur",
        userPfp: "/mypfp.jpg",
        tags: ["Story", "Daily"],
        title: "This is placeholder title",
        content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Consequuntur veniam fugiat velit inventore perspiciatis fuga numquam
         rerum cupiditate impedit magni id, ex voluptatum nam qui, tempore tenetur at odio enim minima? 
         Pariatur consequuntur optio quam aspernatur repudiandae nihil dicta corporis vero, atque, est magnam dignissimos 
         ratione reprehenderit ipsum eum mollitia et, molestiae nesciunt. Voluptate consectetur consequuntur, dolorem 
         excepturi earum voluptates! Laborum sit modi eum culpa. Nobis atque deleniti corporis dolor, id iure libero perferendis
          quasi asperiores numquam. Voluptas voluptates dolorum assumenda quae animi non corporis voluptatem nesciunt ad commodi deserunt 
          consequatur dignissimos, quibusdam, adipisci exercitationem impedit, quod obcaecati dolore explicabo veritatis distinctio repellendus 
          officiis delectus. Culpa atque voluptate facere, excepturi enim cupiditate.`,
        isPublic: false,
        date_posted: "3 days ago",
      },
    ] as blogType[],
  }),
});

interface blogType {
  id: number;
  user: string;
  userPfp: string;
  tags: string[];
  title: string;
  content: string;
  isPublic: boolean;
  date_posted: string;
  likes: number;
  shares: number;
  comment: {
    userPfp: string;
    username: string;
    content: string;
    postedOn: string;
  }[];
}
