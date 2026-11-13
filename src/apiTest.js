async function testBackend() {
    try {
        const response = await fetch("http://localhost:5000/");
        const data = await response.json();

        console.log(data);
    } catch (error) {
        console.error("Failed to connect to BiteBox API", error);
    }

}

testBackend();