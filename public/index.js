$(document).ready(function() {
    var today = new Date(),
        events = [
           +new Date(today.getFullYear(), today.getMonth(), 1),
           +new Date(today.getFullYear(), today.getMonth(), 12),
           +new Date(today.getFullYear(), today.getMonth(), 24),
           +new Date(today.getFullYear(), today.getMonth() + 1, 6),
           +new Date(today.getFullYear(), today.getMonth() + 1, 7),
           +new Date(today.getFullYear(), today.getMonth() + 1, 25),
           +new Date(today.getFullYear(), today.getMonth() + 1, 27),
           +new Date(today.getFullYear(), today.getMonth() - 1, 3),
           +new Date(today.getFullYear(), today.getMonth() - 1, 5),
           +new Date(today.getFullYear(), today.getMonth() - 2, 22),
           +new Date(today.getFullYear(), today.getMonth() - 2, 27)
        ];

    $("#calendar").kendoCalendar({
        value: today,//value starts at current day
        dates: events,
        min: new Date(2009, 0, 1),//0 is January
        max: new Date(2020, 11, 31),//11 is December
        change: function() {
          var value = this.value();
          console.log(value); //value changes to the newly selected date in the calendar
        },
        month: {
            // template for dates in month view
            content: '# if ($.inArray(+data.date, data.dates) != -1) { #' +
                        '<div class="' +
                           '# if (data.value < 10) { #' +
                               "holiday" +
                           '# } else if ( data.value < 20 ) { #' +
                               "midterm" +
                           '# } else { #' +
                               "final" +
                           '# } #' +
                        '">#= data.value #</div>' +
                     '# } else { #' +
                     '#= data.value #' +
                     '# } #'
        },
    });
});
