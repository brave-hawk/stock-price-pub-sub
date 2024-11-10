import connectClient from './utils/connectClient.js';

async function run() {
    try {
        // Build and connect Pub/Sub API client
        const client = await connectClient();

        // Prepare event callback
        const subscribeCallback = (subscription, callbackType, data) => {
            if (callbackType === 'event') {
                // Event received
                console.log(
                    `${subscription.topicName} - ` + `Handling ${data.payload.ChangeEventHeader.entityName} change event ` +
                        `with ID ${data.replayId} ` +
                        `(${subscription.receivedEventCount}/${subscription.requestedEventCount} ` +
                        `events received so far)`
                );
                // Safely log event payload as a JSON string
                console.log(
                    JSON.stringify(
                        data,
                        (key, value) =>
                            /* Convert BigInt values into strings and keep other types unchanged */
                            typeof value === 'bigint'
                                ? value.toString()
                                : value,
                        2
                    )
                );
            } else if (callbackType === 'lastEvent') {
                console.log(`${subscription.topicName} - Reached last event.`);
            } else if (callbackType === 'end') {
                console.log('Client shut down gracefully.');
            }
        };

        // Subscribe to Account change events
        client.subscribe('/data/AccountChangeEvent', subscribeCallback, 3);
    } catch (error) {
        console.error(error);
    }
}

run();
