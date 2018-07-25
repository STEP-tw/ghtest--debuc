const octokit = require('@octokit/rest')();

const userDetails = {
    username: process.argv[2],
    type: 'all'
}

const getRepo = function(){
    octokit.repos.getForUser(userDetails, (error, result) => {
        if (error) {
            console.log(error);
        }
        let userDetails = JSON.parse(JSON.stringify(result));
        console.log(`User have ${userDetails.data.length} repos`);
    });
}

getRepo();
