function Calendar(element) {
    this.el = document.getElementById(element);
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    this.Today = new Date();
    this.Selected = {};
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
    this.dateRow = {};
    var rowNumber;
    if (!this.datesWrapper) {
        this.datesWrapper = createElement('div');
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
            dateCol.innerHTML += i + 1 - this.Selected.FirstDay;
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
};

function createElement(element, className) {
    var el = document.createElement(element);
    if (className) {
        el.className += className;
    }
    return el;
}

function createCalendar() {
    var calendar = new Calendar('basic-calendar');
}

createCalendar();