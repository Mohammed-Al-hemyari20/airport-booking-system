// مصفوفة لتخزين الحجوزات
let bookings = [];
// تحديدالعملية(تعديل او حذف) والصف 
let editIndex = -1; 
let actionType = ''; 
let selectedIndex = -1;

// دالة لعرض البيانات في الجدول
function displayBookings() {
    let bookingsTableBody = document.querySelector('#bookings-table tbody');
    if (!bookingsTableBody) return;
    
    bookingsTableBody.innerHTML = ''; 
    
    for (let i = 0; i < bookings.length; i++) {
        let b = bookings[i];
        bookingsTableBody.innerHTML += '<tr>' +
            '<td>' + b.name + '</td>' +
            '<td>' + b.flightNum + '</td>' +
            '<td>' + b.departure + '</td>' +
            '<td>' + b.destination + '</td>' +
            '<td class="status-ontime">مؤكد</td>' +
            '<td>' +
                '<button class="btn-action btn-edit" onclick="requestAdmin(\'edit\', ' + i + ')">تعديل</button>' +
                '<button class="btn-action btn-delete" onclick="requestAdmin(\'delete\', ' + i + ')">حذف</button>' +
            '</td>' +
        '</tr>';
    }
}

// عرض رسالة الترحيب باسم المستخدم    
let welcomeMessage = document.getElementById('welcomeMessage');
if (welcomeMessage) {
    let savedUser = localStorage.getItem('savedUsername');
    if (savedUser) {
        welcomeMessage.textContent = "مرحباً بك يا " + savedUser + " في النظام!";
    } else {
        welcomeMessage.textContent = "مرحباً بك في مطار الريادة الدولي!";
    }
}
// أكواد التبويبات (Tabs) لحالة الرحلات
let tabBtns = document.querySelectorAll('.tab-btn');
let tabPanes = document.querySelectorAll('.tab-pane');

if (tabBtns.length > 0 && tabPanes.length > 0) {
    for (let i = 0; i < tabBtns.length; i++) {
        tabBtns[i].onclick = function() {
            for (let j = 0; j < tabBtns.length; j++) {
                tabBtns[j].classList.remove('active');
            }
            for (let k = 0; k < tabPanes.length; k++) {
                tabPanes[k].classList.remove('active');
            }
            this.classList.add('active');
            // لمعرفة الجدول المرتبط بهذا الزر
            let tabId = this.getAttribute('data-tab');
            if(tabId && document.getElementById(tabId)) {
                document.getElementById(tabId).classList.add('active');
            }
        };
    }
}

// تحميل البيانات من الذاكرة المحلية
if (localStorage.getItem('flightBookings')) {
    bookings = JSON.parse(localStorage.getItem('flightBookings'));
}
displayBookings();

// إضافةأو تعديل حجز 
let bookingForm = document.getElementById('flight-booking-form');
let submitBtn = document.querySelector('.btn-submit');

if (bookingForm) {
    bookingForm.onsubmit = function() { 
        let name = document.getElementById('passenger-name').value;
        let flightNum = document.getElementById('flight-num').value;
        let departure = document.getElementById('departure').value;
        let destination = document.getElementById('destination').value;

        if (editIndex === -1) {
            //  إضافة حجز جديد
            let newBooking = { name: name, flightNum: flightNum, departure: departure, destination: destination };
            bookings.push(newBooking); 
        } else {
            // حالة حفظ التعديلات على حجز سابق
            bookings[editIndex].name = name;
            bookings[editIndex].flightNum = flightNum;
            bookings[editIndex].departure = departure;
            bookings[editIndex].destination = destination;
            
            // إرجاع الزر لحالته الطبيعية
            editIndex = -1;
            submitBtn.textContent = 'تأكيد الحجز وحفظ البيانات';
            submitBtn.style.backgroundColor = ''; // إرجاع اللون الأصلي
        }

        localStorage.setItem('flightBookings', JSON.stringify(bookings));
        displayBookings(); 

        // تفريغ الحقول
        document.getElementById('passenger-name').value = '';
        document.getElementById('flight-num').value = '';
        document.getElementById('departure').value = '';
        document.getElementById('destination').value = '';

        return false; 
    };
}

//  دالة طلب صلاحية المشرف
function requestAdmin(action, index) {
    actionType = action; // حفظ نوع العملية (تعديل أم حذف)
    selectedIndex = index;   // حفظ رقم الصف
    
    // إظهار نافذة المشرف وتفريغ الحقول
    document.getElementById('admin-check').style.display = 'flex';
    document.getElementById('a-user').value = '';
    document.getElementById('a-pass').value = '';
    document.getElementById('a-error').style.display = 'none';
}

// 2. زر (تأكيد) داخل نافذة المشرف
let authConfirmBtn = document.getElementById('a-confirm');
if (authConfirmBtn) {
    authConfirmBtn.onclick = function() {
        let user = document.getElementById('a-user').value;
        let pass = document.getElementById('a-pass').value;

        if (user === 'admin' && pass === 'admin') {
            // إخفاء النافذة إذا كانت البيانات صحيحة
            document.getElementById('admin-check').style.display = 'none';
            
            // تنفيذ العملية المطلوبة
            if (actionType === 'delete') {
                performDelete(selectedIndex);
            } else if (actionType === 'edit') {
                performEdit(selectedIndex);
            }
        } else {
            // إظهار رسالة الخطأ الحمراء المخفية في النافذة
            document.getElementById('a-error').style.display = 'block';
        }
    };
}

// 3. زر (تراجع) داخل نافذة المشرف
let authCancelBtn = document.getElementById('a-cancel');
if (authCancelBtn) {
    authCancelBtn.onclick = function() {
        document.getElementById('admin-check').style.display = 'none';
    };
}

//  دوال التنفيذ (بعد التحقق) 

// دالة تنفيذ الحذف
function performDelete(index) {
    bookings.splice(index, 1); 
    localStorage.setItem('flightBookings', JSON.stringify(bookings)); 
    displayBookings(); 
}

// دالة تنفيذ التعديل (رفع البيانات للنموذج)
function performEdit(index) {
    let b = bookings[index];
    
    // تعبئة النموذج بالبيانات القديمة
    document.getElementById('passenger-name').value = b.name;
    document.getElementById('flight-num').value = b.flightNum;
    document.getElementById('departure').value = b.departure;
    document.getElementById('destination').value = b.destination;

    // تغيير حالة النموذج ليصبح نموذج "تعديل"
    editIndex = index;
    if(submitBtn) {
        submitBtn.textContent = 'حفظ التعديلات الان';
        submitBtn.style.backgroundColor = '#28a745'; // تغيير لون الزر للأخضر 
    }
    
    // التمرير التلقائي لأعلى نحو النموذج
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}