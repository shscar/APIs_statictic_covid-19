$(document).ready(function () {
    // Initialize DataTable
    const table = $('#regions-table').DataTable({
        paging: true,
        searching: true,
        info: true,
        autoWidth: false,
        responsive: true,
        columns: [
            { title: "#" },
            { title: "ISO" },
            { title: "Region" },
            { title: "Action", orderable: false }
        ]
    });

    // Fetch regions
    function fetchRegions() {
        $('#loading').show(); // Show loading indicator
        $('#regions-data').empty(); // Clear previous table data

        $.ajax({
            url: 'https://covid-19-statistics.p.rapidapi.com/regions',
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'covid-19-statistics.p.rapidapi.com',
                'X-RapidAPI-Key': '--- Masukkan API key ---'
            },
            success: function (response) {
                $('#loading').hide(); // Hide loading indicator
                table.clear(); // Clear DataTable rows

                if (response && response.data) {
                    response.data.forEach((region, index) => {
                        table.row.add([
                            index + 1,
                            region.iso,
                            region.name,
                            `<button class="btn btn-warning btn-sm fetch-country" data-name="${region.name}">View Country</button>`
                        ]);
                    });
                    table.draw(); // Redraw DataTable
                } else {
                    alert('No data available');
                }
            },
            error: function () {
                $('#loading').hide(); // Hide loading indicator
                alert('Failed to fetch regions. Please try again.');
            }
        });
    }
    // Fetch regions on page load
    fetchRegions();

    // Event delegation for "View Country" button
    $(document).on('click', '.fetch-country', function () {
        const countryName = $(this).data('name');

        // Show loading indicator in the modal
        $('.active-case, .critical-case, .new-case, .recovered').text('-'); // Reset values
        $('.nama-negara').text('Loading...');
        $('#staticBackdrop').modal('show'); // Show the modal

        $.ajax({
            url: "https://covid-193.p.rapidapi.com/statistics",
            method: "GET",
            data: {
                country: countryName,
            },
            headers: {
                "X-RapidAPI-Host": "covid-193.p.rapidapi.com",
                "X-RapidAPI-Key": "--- Masukkan API key ---"
            },
            success: function (res) {
                if (res.response && res.response.length > 0) {
                    const data = res.response[0].cases;

                    // Update modal content
                    $('.active-case').text(data.active || 'N/A');
                    $('.critical-case').text(data.critical || 'N/A');
                    $('.new-case').text(data.new || 'N/A');
                    $('.recovered').text(data.recovered || 'N/A');

                    // Capitalize and set country name
                    const formattedCountryName = countryName.charAt(0).toUpperCase() + countryName.slice(1);
                    $('.nama-negara').text(formattedCountryName);
                } else {
                    // Handle case where no data is found
                    $('.nama-negara').text('No data available');
                    $('.active-case, .critical-case, .new-case, .recovered').text('N/A');
                }
            },
            error: function () {
                $('.nama-negara').text('Error fetching data');
                $('.active-case, .critical-case, .new-case, .recovered').text('N/A');
                alert('Failed to fetch country data. Please try again.');
            }
        });
    });
});