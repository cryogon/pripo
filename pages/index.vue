<script lang="ts" setup></script>
<template>
    <main>
        <PostCard/>
        <PostCard/>
    </main>
</template>
<style>
    main{
        transition: 400ms;
        padding:1rem 5rem;
    }
    @media (max-width:600px){
        main{
            padding:1rem;
        }
    }
</style>