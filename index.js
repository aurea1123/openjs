const pcl = require('postchain-client');

const node_api_url = "http://172.21.128.1"; // using default postchain node REST API port

// default blockchain identifier used for testing
const blockchainRID = "78967baa4768cbcef11c508326ffb13a956689fcb6dc3ba17f4b895cbb1577a3";

const rest = pcl.restClient.createRestClient(node_api_url, blockchainRID, 5);
const gtx = pcl.gtxClient.createClient(
    rest,
    Buffer.from(blockchainRID, 'hex'),
    []
);

// create a random key pair
const user = pcl.util.makeKeyPair();

function add_cities() {
    const tx = gtx.newTransaction([user.pubKey]);
    tx.addOperation('insert_city', "Kiev");
    tx.addOperation('insert_city', "Stockholm");
    tx.sign(user.privKey, user.pubKey);
    return tx.postAndWaitConfirmation();
}

function is_city_registered(city_name) {
    return gtx.query("is_city_registered", {city_name: city_name});
}

function testTransactions() {
    const tx = gtx.newTransaction([user.pubKey]);
    const number = Math.random().toString()
    tx.addOperation('gtx_test', 1, number);
    tx.sign(user.privKey, user.pubKey);
    return tx.postAndWaitConfirmation();
}

async function runTest() {
    await add_cities();
    const kiev_registered = await is_city_registered("Kiev");
    console.log("kiev_registered=", kiev_registered);
}

async function runPerformanceTest() {
    setInterval(testTransactions, 20)
}

runPerformanceTest().catch( err => console.log(err.stack));
