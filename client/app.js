function getPost() {
    // var data = "ff77cab534eb4e51105c"
    // fetch('http://localhost:9292/user/posts',
    //     {
    //         method: 'GET',
    //         jsonData: data
    //     }).then(response => {
    //         if (response.ok) {
    //             return response.json();
    //         }
    //         throw new Error('Request failed!');
    //     }, networkError => {
    //         console.log(networkError.message);
    //     })
    const req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', 'http://192.168.0.113:9292/user/posts');
    req.onload = () => {
        console.log(xhr.response);
    };

    req.send();


}