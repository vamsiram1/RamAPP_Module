$root = "c:\Users\ADMIN\Downloads\appModule\SCEmployeeLogin\logs\real appli\analyticsanddistribution"
cd $root

Write-Host "Fixing all remaining errors..." -ForegroundColor Cyan

# Fix SearchResultCardWithStatus - wrong path for Statusbar
Write-Host "1. Fixing SearchResultCardWithStatus..." -ForegroundColor Yellow
(Get-Content "src\components\sale-and-confirm\SearchResultCardWithStatus\SearchResultCardWithStatus.jsx") `
    -replace 'from\s+"\.\.\/\.\.\/\.\.\/\.\.\/widgets\/StatusBar\/Statusbar"', 'from "../../../widgets/StatusBar/Statusbar"' |
    Set-Content "src\components\sale-and-confirm\SearchResultCardWithStatus\SearchResultCardWithStatus.jsx"

# Fix ApplicationStatusTableToManageData - needs 6 levels up
Write-Host "2. Fixing ApplicationStatusTableToManageData..." -ForegroundColor Yellow
(Get-Content "src\components\sale-and-confirm\ApplicationStatus\components\ApplicationStatusTableToManageData\ApplicationStatusTableToManageData.jsx") `
    -replace 'from\s+[''"]\.\.\/\.\.\/\.\.\/\.\.\/widgets\/ApplicationStatusDataTable\/ApplicationStatusDataTable\.module\.css[''"]', "from '../../../../../widgets/ApplicationStatusDataTable/ApplicationStatusDataTable.module.css'" `
    -replace 'from\s+[''"]\.\.\/\.\.\/\.\.\/\.\.\/hooks\/application-status-apis\/ApplicationStatusApis[''"]', "from '../../../../../hooks/application-status-apis/ApplicationStatusApis'" |
    Set-Content "src\components\sale-and-confirm\ApplicationStatus\components\ApplicationStatusTableToManageData\ApplicationStatusTableToManageData.jsx"

# Fix school-sale-conf-assets paths in confirmation containers
Write-Host "3. Fixing confirmation container assets..." -ForegroundColor Yellow
(Get-Content "src\containers\ConfirmationForms\SCHOOL-SALE_CONFIRMATION-CONTAINERS\school-sale-overview-container\SchoolSaleOverviewCont.jsx") `
    -replace 'from\s+[''"]\.\.\/\.\.\/\.\.\/\.\.\/assets\/school-sale-conf-assets\/EditIcon[''"]', "from '../../../../assets/application-status/school-sale-conf-assets/EditIcon'" `
    -replace 'from\s+[''"]\.\.\/\.\.\/\.\.\/\.\.\/assets\/school-sale-conf-assets\/ButtonRightArrow[''"]', "from '../../../../assets/application-status/school-sale-conf-assets/ButtonRightArrow'" |
    Set-Content "src\containers\ConfirmationForms\SCHOOL-SALE_CONFIRMATION-CONTAINERS\school-sale-overview-container\SchoolSaleOverviewCont.jsx"

(Get-Content "src\containers\ConfirmationForms\SCHOOL-SALE_CONFIRMATION-CONTAINERS\school-sale&conf-forms-container\SchoolSaleConfFormsCont.jsx") `
    -replace 'from\s+[''"]\.\.\/\.\.\/\.\.\/\.\.\/assets\/school-sale-conf-assets\/ButtonRightArrow[''"]', "from '../../../../assets/application-status/school-sale-conf-assets/ButtonRightArrow'" |
    Set-Content "src\containers\ConfirmationForms\SCHOOL-SALE_CONFIRMATION-CONTAINERS\school-sale&conf-forms-container\SchoolSaleConfFormsCont.jsx"

(Get-Content "src\containers\ConfirmationForms\COLLEGE-SALE_CONFIRMATION-CONTAINER\college-overview-container\CollegeOverviewContainer.jsx") `
    -replace 'from\s+[''"]\.\.\/\.\.\/\.\.\/\.\.\/assets\/school-sale-conf-assets\/EditIcon[''"]', "from '../../../../assets/application-status/school-sale-conf-assets/EditIcon'" `
    -replace 'from\s+[''"]\.\.\/\.\.\/\.\.\/\.\.\/assets\/school-sale-conf-assets\/ButtonRightArrow[''"]', "from '../../../../assets/application-status/school-sale-conf-assets/ButtonRightArrow'" |
    Set-Content "src\containers\ConfirmationForms\COLLEGE-SALE_CONFIRMATION-CONTAINER\college-overview-container\CollegeOverviewContainer.jsx"

# Fix widget asset paths
Write-Host "4. Fixing widget assets..." -ForegroundColor Yellow
(Get-Content "src\widgets\ApplicationSaleAndConTopSection\ApplicationSaleAndConfTopSec.jsx") `
    -replace 'from\s+[''"]\.\.\/\.\.\/assets\/school-sale-conf-assets\/backArrow\.svg[''"]', "from '../../assets/application-status/school-sale-conf-assets/backArrow.svg'" |
    Set-Content "src\widgets\ApplicationSaleAndConTopSection\ApplicationSaleAndConfTopSec.jsx"

(Get-Content "src\widgets\PaymentPopup\popup-navtabs\PopupNavTabs.jsx") `
    -replace 'from\s+[''"]\.\.\/\.\.\/\.\.\/assets\/school-sale-conf-assets\/CashIcon\.svg[''"]', "from '../../../assets/application-status/school-sale-conf-assets/CashIcon.svg'" `
    -replace 'from\s+[''"]\.\.\/\.\.\/\.\.\/assets\/school-sale-conf-assets\/DDIcon\.svg[''"]', "from '../../../assets/application-status/school-sale-conf-assets/DDIcon.svg'" `
    -replace 'from\s+[''"]\.\.\/\.\.\/\.\.\/assets\/school-sale-conf-assets\/Cheque\.svg[''"]', "from '../../../assets/application-status/school-sale-conf-assets/Cheque.svg'" `
    -replace 'from\s+[''"]\.\.\/\.\.\/\.\.\/assets\/school-sale-conf-assets\/Debit Card\.svg[''"]', "from '../../../assets/application-status/school-sale-conf-assets/Debit Card.svg'" |
    Set-Content "src\widgets\PaymentPopup\popup-navtabs\PopupNavTabs.jsx"

(Get-Content "src\widgets\UploadPicture\UploadPicture.jsx") `
    -replace 'from\s+[''"]\.\.\/\.\.\/assets\/Upload\.svg[''"]', "from '../../assets/application-status/Upload.svg'" |
    Set-Content "src\widgets\UploadPicture\UploadPicture.jsx"

(Get-Content "src\widgets\ApplicationStatusDataTable\ApplicationStatusDataTable.jsx") `
    -replace 'from\s+[''"]\.\.\/\.\.\/assets\/application-status\/crossicon[''"]', "from '../../assets/application-status/crossicon'" |
    Set-Content "src\widgets\ApplicationStatusDataTable\ApplicationStatusDataTable.jsx"

Write-Host "`nPhase 1 complete. Now fixing SCHOOL-SALE-CONFIRMATION components..." -ForegroundColor Cyan
Write-Host "Note: Some files may fail due to Windows path length limits" -ForegroundColor Yellow

# Try to fix SCHOOL-SALE-CONFIRMATION widget imports (may fail due to path length)
$schoolConfFiles = @(
    "src\components\sale-and-confirm\ConfirmationFormComponents\SCHOOL-SALE-CONFIRMATION\school-sale-and-conformation-form\school-sale&conf-academic-info\SchoolSaleConfAcadeInfo.jsx",
    "src\components\sale-and-confirm\ConfirmationFormComponents\SCHOOL-SALE-CONFIRMATION\school-sale-and-conformation-form\school-sale&conf-concestion-info\SchoolSaleConfConceInfo.jsx",
    "src\components\sale-and-confirm\ConfirmationFormComponents\SCHOOL-SALE-CONFIRMATION\school-sale-and-conformation-form\school-sale&conf-language-info\SchoolSaleConfLangInfo.jsx",
    "src\components\sale-and-confirm\ConfirmationFormComponents\SCHOOL-SALE-CONFIRMATION\school-sale-and-conformation-form\school-sale&conf-parent-information\SchoolSaleConfParentInfo.jsx",
    "src\components\sale-and-confirm\ConfirmationFormComponents\SCHOOL-SALE-CONFIRMATION\school-sale-and-conformation-form\school-sale&conf-sibling-info\SchoolSaleConfSiblingInfo.jsx"
)

foreach ($file in $schoolConfFiles) {
    try {
        Write-Host "Fixing $($file.Split('\')[-1])..." -ForegroundColor Yellow
        (Get-Content $file -ErrorAction Stop) `
            -replace 'from\s+[''"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/widgets\/Inputbox\/InputBox[''"]', "from '../../../../../../widgets/Inputbox/InputBox'" `
            -replace 'from\s+[''"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/widgets\/Dropdown\/Dropdown[''"]', "from '../../../../../../widgets/Dropdown/Dropdown'" `
            -replace 'from\s+[''"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/widgets\/Button\/Button[''"]', "from '../../../../../../widgets/Button/Button'" `
            -replace 'from\s+[''"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/assets\/school-sale-conf-assets\/UploadIcon[''"]', "from '../../../../../../assets/application-status/school-sale-conf-assets/UploadIcon'" `
            -replace 'from\s+[''"]\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/assets\/school-sale-conf-assets\/PlusIcon[''"]', "from '../../../../../../assets/application-status/school-sale-conf-assets/PlusIcon'" |
            Set-Content $file
    } catch {
        Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nAll fixes applied!" -ForegroundColor Green
Write-Host "Note: College confirmation components are missing and need to be created or located." -ForegroundColor Yellow
