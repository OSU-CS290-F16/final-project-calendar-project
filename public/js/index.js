/* Wait for DOM to load etc */
$(document).ready(function(){
	//Initialisations
	initialise_calendar();
	initialise_color_pickers();
	initialise_buttons();
	initialise_event_generation();
	initialise_update_event();
	initialise_remove_event();
	initialise_remove_all_events();

	//created a modal to confirm the removal of all events, but didn't end up finding the bug in time, focused on other priorities

	//confirm_remove();
	//deny_remove();	
});

/* Initialise buttons */
function initialise_buttons(){
	$('.btn').button();
}

/* Binds and initialises event generation functionality */
function initialise_event_generation(){
	//Bind event
	$('#btn_gen_event').bind('click', function(){
		//Retrieve template event
		var template_event = $('#external_event_template').clone();
		var background_color = $('#txt_background_color').val();
		var border_color = $('#txt_border_color').val();
		var text_color = $('#txt_text_color').val();
		var title = $('#txt_title').val();
		var description = $('#txt_description').val();

		//Edit id
		$(template_event).attr('id', get_uni_id());

		//Add template data attributes
		$(template_event).attr('data-background', background_color);
		$(template_event).attr('data-border', border_color);
		$(template_event).attr('data-text', text_color);
		$(template_event).attr('data-title', title);
		$(template_event).attr('data-description', description);

		//Style external event
		$(template_event).css('background-color', background_color);
		$(template_event).css('border-color', border_color);
		$(template_event).css('color', text_color);

		//Set text of external event
		$(template_event).text(title);

		//Append to external events container
		$('#external_events').append(template_event);

		//Initialise external event
		initialise_external_event('#' + $(template_event).attr('id'));

		//Show
		$(template_event).fadeIn(2000);
	});
}

/* Initialise external events */
function initialise_external_event(selector){
	//Initialise booking types
	$(selector).each(function(){
		//Make draggable
		$(this).draggable({
			revert: true,
			revertDuration: 0,
			zIndex: 999,
			cursorAt: {
				left: 10,
				top: 1
			}
		});

		//Create event object
		var event_object = {
			title: $.trim($(this).text())
		};

		//Store event in dom to be accessed later
		$(this).data('eventObject', event_object);
	});
}

/* Initialise color pickers */
function initialise_color_pickers(){
	$('.color_picker').miniColors({
		'trigger': 'show',
		'opacity': 'none'
	});
}

/* Initialises calendar */
function initialise_calendar(){
	//Initialise calendar
	$('#calendar').fullCalendar({
		theme: true,
		firstDay: 1,
		header: {
			left: 'today',
			center: 'prev,title,next',
			right: 'month,agendaWeek,agendaDay'
		},
		defaultView: 'agendaWeek',
		minTime: '12:00am',
		maxTime: '11:59pm',
		allDaySlot: false,
		columnFormat: {
			month: 'ddd', //Format for monthly view
			week: 'MMM d <br> dddd ', //Format for week view
			day: 'dddd MMMM d, yyyy' //Format for daily view
		},
		eventSources: [
			{
				url: 'calendar_events.json',
				editable: false
			}
		],
		droppable: true,
		drop: function(date, all_day){
			external_event_dropped(date, all_day, this);
		},
		eventClick: function(cal_event, js_event, view){
			calendar_event_clicked(cal_event, js_event, view);
		},
		editable: true
	});

	//Initialise external events
	initialise_external_event('.external-event');
}

/* Handle an external event that has been dropped on the calendar */
function external_event_dropped(date, all_day, external_event){
	var event_object;
	var copied_event_object;
	var duration = 60;

	//Retrive dropped elemetns stored event object
	event_object = $(external_event).data('eventObject');

	//Copy so that multiple events don't reference same object
	copied_event_object = $.extend({}, event_object);

	//Assigns reported start and end dates from input
	copied_event_object.start = date;
	copied_event_object.end = new Date(date.getTime() + duration * 60000);
	copied_event_object.allDay = all_day;

	//Assigns colors from input
	copied_event_object.backgroundColor = $(external_event).data('background');
	copied_event_object.textColor = $(external_event).data('text');
	copied_event_object.borderColor = $(external_event).data('border');

	//Assigns id, title, and description from input
	copied_event_object.id = get_uni_id();
	copied_event_object.title = $(external_event).data('title');
	copied_event_object.description = $(external_event).data('description');

	//Render event on calendar
	$('#calendar').fullCalendar('renderEvent', copied_event_object, true);
}

/* Initialise event clicks */
function calendar_event_clicked(cal_event, js_event, view){
	//Set generation values
	set_event_generation_values(cal_event.id, cal_event.backgroundColor, cal_event.borderColor, cal_event.textColor, cal_event.title, cal_event.description);
}

/* Set event generation values */
function set_event_generation_values(event_id, bg_color, border_color, text_color, title, description){
	//Set values
	$('#txt_background_color').miniColors('value', bg_color);
	$('#txt_border_color').miniColors('value', border_color);
	$('#txt_text_color').miniColors('value', text_color);
	$('#txt_title').val(title);
	$('#txt_description').val(description);
	$('#txt_current_event').val(event_id);
}

/* Generate unique id */
function get_uni_id(){
	return new Date().getTime() + Math.floor(Math.random()) * 500;
}

/* Initialise update event button */
function initialise_update_event(){
	//Bind event
	$('#btn_update_event').bind('click', function(){

		var current_event_id = $('#txt_current_event').val();

		//Check if the value is found
		if(current_event_id){

			//Retrieve current event
			var current_event = $('#calendar').fullCalendar('clientEvents', current_event_id);

			//Check if current event is found
			if(current_event && current_event.length == 1){

				//Retrieve current event from array
				current_event = current_event[0];

				//Set new values
				current_event.backgroundColor = $('#txt_background_color').val();
				current_event.textColor = $('#txt_text_color').val();
				current_event.borderColor = $('#txt_border_color').val();
				current_event.title = $('#txt_title').val();
				current_event.description = $('#txt_description').val();

				//Update event
				$('#calendar').fullCalendar('updateEvent', current_event);
			}
		}
	});
}

	function initialise_remove_event(){
	$('#btn_remove_event').bind('click', function(){
		var current_event_id = $('#txt_current_event').val();

		//Check if the value is found
		if(current_event_id){

			//Retrieve current event
			var current_event = $('#calendar').fullCalendar('clientEvents', current_event_id);

			//Check if found
			if(current_event && current_event.length == 1){

				//Retrieve current event from array
				current_event = current_event[0];
				//remove selected event from the calendar
					$('#calendar').fullCalendar('removeEvents', current_event_id);
		 		}
	 		}
		});
	}
	function initialise_remove_all_events(){
	$('#btn_remove_all_events').bind('click', function(){
		//remove all events from the calendar
		$('#calendar').fullCalendar('removeEvents');

	});
}
/*
function initialise_remove_all_events(){
	$('#btn_remove_all_elements').bind('click', function(){
		//console.log("click on remove all");
		$('#calendar').fullCalendar('removeEvents');
		fc-confirmation.style.display = "block";
		});
	}

	function confirm_remove(){
	$('#btn_yes').bind('click', function(){
		console.log("yes clicked");
		$('#calendar').fullCalendar('removeEvents');
		fc-confirmation.style.display = "none";
		});
	}

	function deny_remove(){
	$('#btn_yes').bind('click', function(){
		console.log("no clicked");
		fc-confirmation.style.display = "none";
		});
	}*/
