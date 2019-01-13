function Calendar(element, events) {
    this.el = document.getElementById(element);
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    this.Today = new Date();
    this.Selected = {};
    this.events = events;
    this.changeMonth(this.Today.getMonth(), this.Today.getFullYear());
}

Calendar.prototype.drawHeader = function () {
    var self = this;
    if (!this.header) {
        this.header = createElement('div', 'cl-heading');
        this.title = createElement('div', 'cl-title');
        this.arrowLeft = createElement('div', 'cl-arrow-left cl-arrow');
        this.arrowRight = createElement('div', 'cl-arrow-right cl-arrow');
        this.header.appendChild(this.arrowLeft);
        this.header.appendChild(this.title);
        this.header.appendChild(this.arrowRight);
        this.arrowLeft.innerHTML = '<';
        this.arrowRight.innerHTML = '>';
        this.arrowLeft.addEventListener('click', function () {
            self.changeMonth(self.Selected.Date.getMonth() - 1, self.Selected.Date.getFullYear());
        });
        this.arrowRight.addEventListener('click', function () {
            self.changeMonth(self.Selected.Date.getMonth() + 1, self.Selected.Date.getFullYear());
        });
        this.el.appendChild(this.header);
    }
    this.title.innerHTML = this.months[this.Selected.Month] + ', ' + this.Selected.Year;
}

Calendar.prototype.drawDays = function () {
    if (!this.daysHeader) {
        this.daysHeader = createElement('div', 'cl-days-header');
        for (var i = 0; i < 7; i++) {
            var day = createElement('div', 'cl-day');
            day.innerHTML += this.days[i];
            this.daysHeader.appendChild(day);
        }
        this.el.appendChild(this.daysHeader);
    }
}

Calendar.prototype.drawDates = function () {
    var self = this;
    this.dateRow = {};
    var rowNumber;
    if (!this.datesWrapper) {
        this.datesWrapper = createElement('div');
        this.datesWrapper.addEventListener('click', function (event) {
            var targetId = event.target.id;
            if (targetId) {
                self.Selected.Date = new Date(getformattedDate(targetId, (self.Selected.Month + 1), self.Selected.Year));
                self.Selected.events = self.getSelectedDateEvents();
                self.renderEvents();
            }
        });
    }
    var rowsNode = document.getElementsByClassName('cl-date-row');
    while (rowsNode.length) {
        this.datesWrapper.removeChild(rowsNode[0]);
    }
    for (var i = 0; i < this.Selected.daysCount + this.Selected.FirstDay; i++) {
        rowNumber = Math.floor(i / 7);
        if (i % 7 === 0) {
            this.dateRow[rowNumber] = createElement('div', 'cl-date-row');
            this.datesWrapper.appendChild(this.dateRow[rowNumber]);
        }
        var dateCol = createElement('div', 'cl-date');
        if (i >= this.Selected.FirstDay) {
            var date = i + 1 - this.Selected.FirstDay;
            var formattedDate = formatDate(new Date(getformattedDate(date, (this.Selected.Month + 1), this.Selected.Year)));
            var selectedDateEvents = this.events[formattedDate];
            dateCol.id = date;
            dateCol.className += (selectedDateEvents && selectedDateEvents.length) ? ' cl-has-event' : '';
            dateCol.innerHTML += date;
        }
        this.dateRow[rowNumber].appendChild(dateCol);
    }
    this.el.appendChild(this.datesWrapper);
}

Calendar.prototype.changeMonth = function (month, year) {
    var newDate = new Date();
    if (month === 12) {
        year++;
    } else if (month === -1) {
        year--;
    }
    newDate.setMonth(month);
    newDate.setFullYear(year);
    this.Selected.Date = newDate;
    this.Selected.Month = this.Selected.Date.getMonth();
    this.Selected.Year = this.Selected.Date.getFullYear();
    this.Selected.FirstDay = new Date(this.Selected.Year, (this.Selected.Month), 1).getDay();
    this.Selected.LastDay = new Date(this.Selected.Year, (this.Selected.Month + 1), 0).getDay();
    this.Selected.daysCount = new Date(this.Selected.Year, (this.Selected.Month + 1), 0).getDate();
    this.drawHeader();
    this.drawDays();
    this.drawDates();
    this.Selected.events = [];
    this.renderEvents();
};

Calendar.prototype.getSelectedDateEvents = function () {
    var selectedDate = formatDate(this.Selected.Date);
    return this.events[selectedDate];
};

Calendar.prototype.renderEvents = function () {
    if (!this.eventWrapper) {
        this.eventWrapper = createElement('div', 'cl-event-wrapper');
    }
    var rowsNode = document.getElementsByClassName('cl-event-row');
    while (rowsNode.length) {
        this.eventWrapper.removeChild(rowsNode[0]);
    }
    for (var eventIdx = 0; eventIdx < this.Selected.events.length; eventIdx++) {
        var eventRow = createElement('div', 'cl-event-row');
        var eventTitle = createElement('div', 'cl-event-title');
        var eventDescription = createElement('div', 'cl-event-desc');
        eventTitle.innerHTML = this.Selected.events[eventIdx].title;
        eventDescription.innerHTML = this.Selected.events[eventIdx].description;
        eventRow.appendChild(eventTitle);
        eventRow.appendChild(eventDescription);
        this.eventWrapper.appendChild(eventRow);
    }
    this.el.appendChild(this.eventWrapper);
};

function getformattedDate(d, m, y) {
    var dd = d;
    var mm = m;
    var yyyy = y;
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return mm + '/' + dd + '/' + yyyy;
}

function formatDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return dd + '/' + mm + '/' + yyyy;
}

function createElement(element, className) {
    var el = document.createElement(element);
    if (className) {
        el.className += className;
    }
    return el;
}

function createCalendar(events) {
    var eventDict = {};
    for (var eventIdx = 0; eventIdx < events.length; eventIdx++) {
        if (!eventDict[events[eventIdx].date]) {
            eventDict[events[eventIdx].date] = [events[eventIdx]];
        } else {
            eventDict[events[eventIdx].date].push(events[eventIdx]);
        }
    }
    var calendar = new Calendar('basic-calendar', eventDict);
}

var events = [{
        date: '01/01/2019',
        title: 'Event 1',
        description: 'Event description goes here',
    },
    {
        date: '01/01/2019',
        title: 'Event 2',
        description: 'Event description goes here',
    },
    {
        date: '05/01/2019',
        title: 'Event 3',
        description: 'Event description goes here',
    },
    {
        date: '01/01/2019',
        title: 'Event 4',
        description: 'Event description goes here',
    },
    {
        date: '01/01/2019',
        title: 'Event 5',
        description: 'Event description goes here',
    },
    {
        date: '10/01/2019',
        title: 'Event 6',
        description: 'Event description goes here',
    },
    {
        date: '10/12/2018',
        title: 'Event 7',
        description: 'Event description goes here',
    },
    {
        date: '01/01/2019',
        title: 'Event 8',
        description: 'Event description goes here',
    }
];
createCalendar(events);