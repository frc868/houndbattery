(async () => {
    const fetchJson = async (url: string, options: RequestInit) => {
        try {
            const response = await fetch(url, options);
            const text = await response.text();
            console.log(`Response from ${url}: ${text}`);
            return JSON.parse(text);
        } catch (error) {
            console.error('Error fetching JSON:', error);
            return null;
        }
    };

    const tokenResponse = await fetchJson('https://techhounds.club/api/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            clientName: 'TechHOUNDS',
            clientId: 'OlOKdxFd249GaTUUNhApMZUd9itRZo1B',
            clientSecret: 'oaiv+aIHsrUYlrNGuWieCUmAVlvfTMlXaXf2lDhxLdw73MpFp/Rrx9EMpCLn352Tm4q/6K2vXGt2oX6vhBnrVJ4sqqaRRb09adsGvC6Q/SrryFdQ5stAXSDDJPGIxmMA2oXrHNkajm1PkA9uXEMAuG1ULg36ZaIC73LilDJcInjrI6me3K89IhKciD+OpFwPiUlgArFEeCTipBlFS2tOasyFFy+8EOnX5TegGmrakAIFQZcnEy2rf83NYDQqioOgALg3HLzxEmP22VWcax6b7+nkbU7Kf2attjw1BK8Fr52+8He4PsBSBFbXUCkxzKGwqV8S3ItXW0HBD79Tvjg=='
        }),
    });

    if (!tokenResponse || !tokenResponse.token) {
        console.error('Failed to obtain bearer token');
        return;
    }

    const token = tokenResponse.token;

    // Add a new battery
    const addBatteryResponse = await fetchJson('https://techhounds.club/api/battery', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: 'NewBattery' }),
    });

    if (!addBatteryResponse) {
        console.error('Failed to add battery');
        return;
    }

    const batteryData = addBatteryResponse;
    console.log('Added Battery:', batteryData);

    // Retrieve battery information
    const getBatteryResponse = await fetchJson(`https://techhounds.club/api/battery/${batteryData.id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!getBatteryResponse) {
        console.error('Failed to get battery details');
        return;
    }

    const batteryDetails = getBatteryResponse;
    console.log('Battery Details:', batteryDetails);

    // Log battery activity
    const logResponse = await fetchJson('https://techhounds.club/api/batterylog', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            batteryId: batteryData.id,
            voltage: 12.7,
            enteredAt: new Date().toISOString(),
        }),
    });

    if (!logResponse) {
        console.error('Failed to add battery log');
        return;
    }

    const logData = logResponse;
    console.log('Battery Log:', logData);

    // Retrieve battery log information
    const getLogResponse = await fetchJson(`https://techhounds.club/api/batterylog/${logData.id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!getLogResponse) {
        console.error('Failed to get battery log details');
        return;
    }

    const logDetails = getLogResponse;
    console.log('Log Details:', logDetails);
})();  