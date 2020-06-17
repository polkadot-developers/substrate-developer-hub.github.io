window.addEventListener("load", function() {
    let pathname = window.location.pathname;

    // Full, hardcoded redirects based on current path
    let redirects = {
        // "/impossible/example/page/": "/new/page/here/"
    };
    // Custom full redirects first
    if (pathname in redirects) {
        window.location.href = redirects[pathname];
        return;
    }

    // We want to redirect:
    // * https://substrate.dev/docs/next/...
    // ------------------------^ [1] ^[2]
    // * https://substrate.dev/docs/en/next/...
    // ------------------------^ [1] --^ [3]
    // pathArray[0] is an empty string

    var pathArray = pathname.split('/');

    // General redirect of user from `next` to `knowledgebase`
    if (pathArray[1] == 'docs') {
        if (pathArray[2] == 'next') {
            pathArray[2] = 'knowledgebase';
            window.location.href = pathArray.join('/');
        } else if (pathArray[3] == 'next') {
            pathArray[3] = 'knowledgebase';
            window.location.href = pathArray.join('/');
        }
    }
});
