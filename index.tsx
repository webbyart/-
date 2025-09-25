/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { createClient } from '@supabase/supabase-js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// --- Supabase Configuration ---
// IMPORTANT: Replace with your Supabase Project URL and Anon Key from your Supabase dashboard
const supabaseUrl = 'YOUR_SUPABASE_URL'; 
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);


// --- GLOBAL STATE ---
let loanData: Record<string, any> = {};
// const loanDatabase: Record<string, any>[] = []; // In-memory database is now replaced by Supabase

// --- EMPLOYEE DATA ---
const employees = [
    { id: 'SAT0009', name_en: 'Miss Duangrat Thanachaiwongnart', name_th: 'นางสาวดวงรัตน์ ธนชัยวงศ์นาถ', department: 'HR', image: 'พนักงาน_Images/SAT0009.รูปภาพ.043822.png' },
    { id: 'SAT0011', name_en: 'Miss Thitaporn Jareonwong', name_th: 'นางสาวฐิตาภรณ์ เจริญวงศ์', department: 'PC&L', image: 'พนักงาน_Images/SAT0011.รูปภาพ.043840.png' },
    { id: 'SAT0016', name_en: 'Mr.Akekarin Suthammaruk', name_th: 'นายเอกรินทร์ สุธรรมรักษ์', department: 'QA/QC', image: 'พนักงาน_Images/SAT0016.รูปภาพ.043937.png' },
    { id: 'SAT0020', name_en: 'Mr.Samarn Buchatham', name_th: 'นายสมาน บูชาธรรม', department: 'Maintenance', image: 'พนักงาน_Images/SAT0020.รูปภาพ.043951.png' },
    { id: 'SAT0085', name_en: 'Mr.Ekkaphop Phetsuriya', name_th: 'นายเอกภพ เพ็ชรสุริยา', department: 'Production', image: 'พนักงาน_Images/SAT0085.รูปภาพ.044005.png' },
    { id: 'SAT0106', name_en: 'Mr.Supachai Kumngam', name_th: 'นายศุภชัย คำงาม', department: 'Maintenance', image: 'พนักงาน_Images/SAT0106.รูปภาพ.044015.png' },
    { id: 'SAT0107', name_en: 'Miss Jirawan Inthong', name_th: 'นางสาวจิราวรรณ อินทอง', department: 'QA/QC', image: 'พนักงาน_Images/SAT0107.รูปภาพ.044031.png' },
    { id: 'SAT0214', name_en: 'Miss Benjawan Tidchat', name_th: 'นางสาวเบ็ญจวรรณ ทิดชาติ', department: 'HR', image: 'พนักงาน_Images/SAT0214.รูปภาพ.044106.png' },
    { id: 'SAT0247', name_en: 'Mr.Thanawuth Phuathaveephong', name_th: 'นายธนวุฒิ พัวทวีพงศ์', department: 'Sales / Purchasing / PE', image: 'พนักงาน_Images/SAT0247.รูปภาพ.044128.png' },
    { id: 'SAT0257', name_en: 'Miss Rungtiwa Rossoda', name_th: 'นางสาวรุ่งทิวา รสโสดา', department: 'QA/QC', image: 'พนักงาน_Images/SAT0257.รูปภาพ.044141.png' },
    { id: 'SAT0260', name_en: 'Miss Chualadda Mongkholgeat', name_th: 'นางสาวช่อลัดดา มงคลเกตุ', department: 'Production', image: 'พนักงาน_Images/SAT0260.รูปภาพ.044154.png' },
    { id: 'SAT0312', name_en: 'Miss Kitsana Aorak', name_th: 'นางสาวกฤษณา โอรักษ์', department: 'Accounting/Finance', image: 'พนักงาน_Images/SAT0312.รูปภาพ.044205.jpg' },
    { id: 'SAT0394', name_en: 'Mr.Sopa Arijit', name_th: 'นายโสภา อาริจิตร์', department: 'PC&L', image: 'พนักงาน_Images/SAT0394.รูปภาพ.044230.png' },
    { id: 'SAT0396', name_en: 'Miss Wiraya Sabwilai', name_th: 'นางสาววิระยา ทรัพย์วิลัย', department: 'QMS', image: 'พนักงาน_Images/SAT0396.รูปภาพ.044242.png' },
    { id: 'SAT0403', name_en: 'Miss Sasiwimol Chuchoeddok', name_th: 'นางสาวศศิวิมล ชูเชิดดอก', department: 'Accounting/Finance', image: 'พนักงาน_Images/SAT0403.รูปภาพ.044252.jpg' },
    { id: 'SAT0406', name_en: 'Miss Jariya Phiwphan', name_th: 'นางสาวจริยา ผิวพรรณ์', department: 'HR', image: 'พนักงาน_Images/SAT0406.รูปภาพ.044310.png' },
    { id: 'SAT0416', name_en: 'Miss Pornpun Chopchoen', name_th: 'นางสาวพรพรรณ ชอบชื่น', department: 'Sales / Purchasing', image: 'พนักงาน_Images/SAT0416.รูปภาพ.044328.png' },
    { id: 'SAT0417', name_en: 'Mr.Kitthana Khoommoll', name_th: 'นายกิตติ์ธนา คำมูล', department: 'HR', image: 'พนักงาน_Images/SAT0417.รูปภาพ.044410.png' },
    { id: 'SAT0433', name_en: 'Miss Thananya Sindee', name_th: 'นางสาวธนัญญา สินดี', department: 'Sales / Purchasing', image: 'พนักงาน_Images/SAT0433.รูปภาพ.044430.png' },
    { id: 'SAT0448', name_en: 'Miss Parichud Soikudrua', name_th: 'นางสาวปาริฉัตร สร้อยกุดเรือ', department: 'PC&L', image: 'พนักงาน_Images/SAT0448.รูปภาพ.044446.png' },
    { id: 'SAT0458', name_en: 'Miss Thanaporn Kaewhan', name_th: 'นางสาวธนาภรณ์ แก้วหาญ', department: 'HR', image: 'พนักงาน_Images/SAT0458.รูปภาพ.044455.png' },
    { id: 'SAT0490', name_en: 'Mr.Ronnakorn Chantaranetsakul', name_th: 'นายรณกร จันทรเนตรสกุล', department: 'Production Engineering', image: 'พนักงาน_Images/SAT0490.รูปภาพ.044507.png' },
    { id: 'SAT0491', name_en: 'Mr.Tokumichi Okazaki', name_th: 'นายโทคุมิชิ โอกาซากิ', department: 'Management', image: 'พนักงาน_Images/SAT0491.รูปภาพ.044520.png' },
    { id: 'SAT0492', name_en: 'Mr.Takanori Nakazawa', name_th: 'นายทาคาโนริ นากาซาวะ', department: 'Management', image: 'พนักงาน_Images/SAT0492.รูปภาพ.044528.png' },
    { id: 'SAT0505', name_en: 'Miss Lalana Kulawong', name_th: 'นางสาวลลนา กุลวงศ์', department: 'Accounting/Finance', image: 'พนักงาน_Images/Miss Lalana Kulawong.รูปภาพ.025849.png' },
];

// --- UTILITY FUNCTIONS ---
function $<T extends HTMLElement>(selector: string): T {
    const element = document.querySelector<T>(selector);
    if (!element) throw new Error(`Element "${selector}" not found.`);
    return element;
}

// --- DOM ELEMENTS ---
const loadingOverlay = $<HTMLDivElement>('#loading-overlay');
const formStep = $<HTMLDivElement>('#form-step');
const supervisorStep = $<HTMLDivElement>('#supervisor-step');
const itStep = $<HTMLDivElement>('#it-step');
const summaryStep = $<HTMLDivElement>('#summary-step');

const loanForm = $<HTMLFormElement>('#loan-form');
const employeeSelect = $<HTMLSelectElement>('#employeeSelect');
const employeeNameInput = $<HTMLInputElement>('#employeeName');
const employeeImage = $<HTMLImageElement>('#employeeImage');

const approveButton = $<HTMLButtonElement>('#approve-button');
const verifyButton = $<HTMLButtonElement>('#verify-button');
const exportPdfButton = $<HTMLButtonElement>('#export-pdf-button');
const newRequestButton = $<HTMLButtonElement>('#new-request-button');

// History Modal Elements
const viewHistoryButton = $<HTMLButtonElement>('#view-history-button');
const historyModal = $<HTMLDivElement>('#history-modal');
const closeHistoryModalButton = $<HTMLButtonElement>('#close-history-modal');
const historyContent = $<HTMLDivElement>('#history-content');


// --- SIGNATURE PAD FACTORY ---
function createSignaturePad(canvasId: string, clearButtonId: string) {
    const canvas = $<HTMLCanvasElement>(`#${canvasId}`);
    const clearButton = $<HTMLButtonElement>(`#${clearButtonId}`);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error(`Could not get 2D context for ${canvasId}`);

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const resizeCanvas = () => {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * ratio;
        canvas.height = rect.height * ratio;
        ctx.scale(ratio, ratio);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    };

    const getEventPosition = (event: MouseEvent | TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        const touch = event instanceof TouchEvent ? event.touches[0] : event;
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        };
    };

    const startDrawing = (event: MouseEvent | TouchEvent) => {
        isDrawing = true;
        const pos = getEventPosition(event);
        [lastX, lastY] = [pos.x, pos.y];
        event.preventDefault();
    };

    const draw = (event: MouseEvent | TouchEvent) => {
        if (!isDrawing) return;
        const pos = getEventPosition(event);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        [lastX, lastY] = [pos.x, pos.y];
        event.preventDefault();
    };

    const stopDrawing = () => { isDrawing = false; };
    const clear = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
    const getDataURL = () => canvas.toDataURL('image/png');
    const isEmpty = () => {
        const blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        return canvas.toDataURL() === blank.toDataURL();
    };

    ['mousedown', 'touchstart'].forEach(event => canvas.addEventListener(event, startDrawing));
    ['mousemove', 'touchmove'].forEach(event => canvas.addEventListener(event, draw));
    ['mouseup', 'mouseout', 'touchend'].forEach(event => canvas.addEventListener(event, stopDrawing));
    clearButton.addEventListener('click', clear);

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return { clear, getDataURL, isEmpty, resize: resizeCanvas };
}

const borrowerPad = createSignaturePad('signature-pad-borrower', 'clear-signature-borrower');
const supervisorPad = createSignaturePad('signature-pad-supervisor', 'clear-signature-supervisor');
const itPad = createSignaturePad('signature-pad-it', 'clear-signature-it');

// --- EMPLOYEE SELECTION LOGIC ---
function populateEmployeeSelector() {
    employees.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp.id;
        option.textContent = `${emp.id} - ${emp.name_th}`;
        employeeSelect.appendChild(option);
    });
}
employeeSelect.addEventListener('change', () => {
    const selectedEmployee = employees.find(emp => emp.id === employeeSelect.value);
    if (selectedEmployee) {
        employeeNameInput.value = selectedEmployee.name_th;
        employeeImage.src = selectedEmployee.image;
        employeeImage.classList.remove('hidden');
        viewHistoryButton.disabled = false;
    } else {
        employeeNameInput.value = '';
        employeeImage.src = '';
        employeeImage.classList.add('hidden');
        viewHistoryButton.disabled = true;
    }
});

// --- PHOTO PREVIEW LOGIC ---
document.querySelectorAll<HTMLInputElement>('.photo-input').forEach(input => {
    input.addEventListener('change', () => {
        const file = input.files?.[0];
        if (file) {
            const preview = $<HTMLImageElement>(`#preview${input.id.replace('photo', '')}`);
            preview.src = URL.createObjectURL(file);
        }
    });
});

// --- DATA DISPLAY LOGIC ---
function createSummaryHTML(data: Record<string, any>) {
    const accessories = Array.isArray(data.accessories) ? data.accessories.join(', ') : (data.accessories || 'ไม่มี');
    const photoHTML = Object.entries(data.photos)
        .map(([key, src]) => src ? `<div><p>${key}</p><img src="${src as string}" alt="${key}"></div>` : '')
        .join('');

    return `
        <h3>ข้อมูลผู้ยืมและทรัพย์สิน</h3>
        <p><strong>รหัสพนักงาน:</strong> ${data.employeeId}</p>
        <p><strong>ชื่อพนักงาน:</strong> ${data.employeeName}</p>
        <p><strong>รหัสทรัพย์สิน:</strong> ${data.assetId}</p>
        <h3>รายละเอียดการยืม</h3>
        <p><strong>อุปกรณ์เสริม:</strong> ${accessories}</p>
        <p><strong>อื่นๆ:</strong> ${data.otherAccessories || 'ไม่มี'}</p>
        <p><strong>วัตถุประสงค์:</strong> ${data.purpose}</p>
        <p><strong>วันที่ยืม:</strong> ${new Date(data.startDate).toLocaleString()}</p>
        <p><strong>วันที่คืน:</strong> ${new Date(data.returnDate).toLocaleString()}</p>
        <h3>รูปถ่ายอุปกรณ์</h3>
        <div class="summary-photos">${photoHTML}</div>
    `;
}

// --- FORM SUBMISSION & WORKFLOW ---
loanForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (borrowerPad.isEmpty()) {
        alert('กรุณาลงลายเซ็นผู้ยืม');
        return;
    }
    loadingOverlay.classList.remove('hidden');

    const formData = new FormData(loanForm);
    loanData = Object.fromEntries(formData.entries());
    loanData.accessories = formData.getAll('accessories');
    loanData.signatures = { borrower: borrowerPad.getDataURL() };
    loanData.photos = {};
    
    // Read photo files as data URLs
    const photoPromises = Array.from(document.querySelectorAll<HTMLInputElement>('.photo-input'))
        .filter(input => input.files && input.files[0])
        .map(input => new Promise<void>(resolve => {
            const reader = new FileReader();
            reader.onload = () => {
                const key = input.id.replace('photo', '');
                loanData.photos[key] = reader.result;
                resolve();
            };
            reader.readAsDataURL(input.files![0]);
        }));

    await Promise.all(photoPromises);

    $('#summary-for-supervisor').innerHTML = createSummaryHTML(loanData);
    
    formStep.classList.add('hidden');
    supervisorStep.classList.remove('hidden');
    supervisorPad.resize(); // Resize canvas now that it's visible
    loadingOverlay.classList.add('hidden');
    window.scrollTo(0, 0);
});

approveButton.addEventListener('click', () => {
    if (supervisorPad.isEmpty()) {
        alert('กรุณาลงลายเซ็นผู้บังคับบัญชา');
        return;
    }
    loanData.signatures.supervisor = supervisorPad.getDataURL();
    $('#summary-for-it').innerHTML = createSummaryHTML(loanData);

    supervisorStep.classList.add('hidden');
    itStep.classList.remove('hidden');
    itPad.resize(); // Resize canvas now that it's visible
    window.scrollTo(0, 0);
});

verifyButton.addEventListener('click', async () => {
    if (itPad.isEmpty()) {
        alert('กรุณาลงลายเซ็นเจ้าหน้าที่ IT');
        return;
    }
    loanData.signatures.it = itPad.getDataURL();
    loadingOverlay.classList.remove('hidden');

    // Prepare data for Supabase
    const supabaseData = {
        employeeId: loanData.employeeId,
        employeeName: loanData.employeeName,
        assetId: loanData.assetId,
        accessories: loanData.accessories,
        otherAccessories: loanData.otherAccessories,
        purpose: loanData.purpose,
        startDate: loanData.startDate,
        returnDate: loanData.returnDate,
        photos: loanData.photos, // Assumes JSONB column
        signatures: loanData.signatures, // Assumes JSONB column
        timestamp: new Date().toISOString(),
    };
    
    try {
        const { error } = await supabase
            .from('loan_requests')
            .insert([supabaseData]);

        if (error) throw error;

        // Populate final summary for export
        const exportContent = $('#export-content');
        exportContent.innerHTML = `
            ${createSummaryHTML(loanData)}
            <h3>ลายเซ็น</h3>
            <div class="summary-signatures">
                <div class="signature-item">
                    <img src="${loanData.signatures.borrower}" alt="ลายเซ็นผู้ยืม">
                    <p>ผู้ยืม</p>
                </div>
                <div class="signature-item">
                    <img src="${loanData.signatures.supervisor}" alt="ลายเซ็นผู้บังคับบัญชา">
                    <p>ผู้บังคับบัญชา</p>
                </div>
                <div class="signature-item">
                    <img src="${loanData.signatures.it}" alt="ลายเซ็นเจ้าหน้าที่ IT">
                    <p>เจ้าหน้าที่ IT</p>
                </div>
            </div>
        `;

        itStep.classList.add('hidden');
        summaryStep.classList.remove('hidden');
        window.scrollTo(0, 0);

    } catch (error) {
        console.error("Error saving to Supabase:", error);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + (error as Error).message);
    } finally {
        loadingOverlay.classList.add('hidden');
    }
});


exportPdfButton.addEventListener('click', async () => {
    loadingOverlay.classList.remove('hidden');
    const content = $('#export-content');
    
    try {
        const canvas = await html2canvas(content, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        
        let finalImgWidth = pdfWidth;
        let finalImgHeight = pdfWidth / ratio;

        if (finalImgHeight > pdfHeight) {
            finalImgHeight = pdfHeight;
            finalImgWidth = pdfHeight * ratio;
        }

        pdf.addImage(imgData, 'PNG', 0, 0, finalImgWidth, finalImgHeight);
        pdf.save(`loan-request-${loanData.employeeId}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("เกิดข้อผิดพลาดในการสร้างไฟล์ PDF");
    } finally {
        loadingOverlay.classList.add('hidden');
    }
});

newRequestButton.addEventListener('click', () => {
    loanData = {};
    loanForm.reset();
    borrowerPad.clear();
    supervisorPad.clear();
    itPad.clear();

    document.querySelectorAll('.photo-preview').forEach(img => (img as HTMLImageElement).src = '');
    employeeImage.classList.add('hidden');
    viewHistoryButton.disabled = true;
    
    summaryStep.classList.add('hidden');
    formStep.classList.remove('hidden');
    window.scrollTo(0, 0);
});

// --- HISTORY MODAL LOGIC ---
async function displayLoanHistory(employeeId: string) {
    loadingOverlay.classList.remove('hidden');
    try {
        const { data: records, error } = await supabase
            .from('loan_requests')
            .select('*')
            .eq('employeeId', employeeId)
            .order('timestamp', { ascending: false });

        if (error) throw error;

        if (!records || records.length === 0) {
            historyContent.innerHTML = '<p>ไม่พบประวัติการยืมสำหรับพนักงานท่านนี้</p>';
            return;
        }

        historyContent.innerHTML = records.map((record: any) => `
            <div class="history-item">
                <p><strong>รหัสทรัพย์สิน:</strong> ${record.assetId}</p>
                <p><strong>วันที่ยืม:</strong> ${new Date(record.startDate).toLocaleString()}</p>
                <p><strong>วันที่คืน:</strong> ${new Date(record.returnDate).toLocaleString()}</p>
                <p><strong>วัตถุประสงค์:</strong> ${record.purpose}</p>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error fetching history from Supabase:", error);
        historyContent.innerHTML = `<p style="color: red;">เกิดข้อผิดพลาดในการดึงข้อมูลประวัติ: ${(error as Error).message}</p>`;
    } finally {
        loadingOverlay.classList.add('hidden');
    }
}

viewHistoryButton.addEventListener('click', async () => {
    const selectedEmployeeId = employeeSelect.value;
    if (selectedEmployeeId) {
        historyContent.innerHTML = '<p>กำลังโหลด...</p>';
        historyModal.classList.remove('hidden');
        await displayLoanHistory(selectedEmployeeId);
    }
});

closeHistoryModalButton.addEventListener('click', () => {
    historyModal.classList.add('hidden');
});

historyModal.addEventListener('click', (event) => {
    if (event.target === historyModal) {
        historyModal.classList.add('hidden');
    }
});


// --- INITIALIZATION ---
populateEmployeeSelector();
window.scrollTo(0, 0);