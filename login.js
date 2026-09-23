document.getElementById('loginForm').onsubmit = function(event) {
            event.preventDefault(); // إيقاف تحديث الصفحة
            
            let myName = document.getElementById('username').value;
            let myPass = document.getElementById('password').value;

            if(myPass === '1234') {
                // حفظ الاسم
                localStorage.setItem('savedUsername', myName);
                // الانتقال لصفحة المشروع
                window.location.href = 'project.html';
            } else {
                alert('كلمة المرور خطأ');
            }
        };