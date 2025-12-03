# Fix all remaining import path issues

$root = "c:\Users\ADMIN\Downloads\appModule\SCEmployeeLogin\logs\real appli\analyticsanddistribution"
cd $root

# Fix Frame assets in ApplicationSaleDetails
(Get-Content "src\components\sale-and-confirm\CollegSaleFormComponents\ApplicationDetails\ApplicationSaleDetails.jsx") `
    -replace 'from\s+"\.\.\/\.\.\/\.\.\/\.\.\/assets\/Frame 1410092236\.svg"', 'from "../../../../assets/application-status/Frame 1410092236.svg"' |
    Set-Content "src\components\sale-and-confirm\CollegSaleFormComponents\ApplicationDetails\ApplicationSaleDetails.jsx"

# Fix uploadAnnexureIcon
$files = @(
    "src\components\sale-and-confirm\CollegSaleFormComponents\ParentInformation\ParentInformation.jsx",
    "src\components\sale-and-confirm\CollegSaleFormComponents\ParentInformation\ParentInformationForSchool.jsx"
)
foreach ($f in $files) {
    (Get-Content $f) -replace 'from\s+"\.\.\/\.\.\/\.\.\/\.\.\/assets\/uploadAnnexureIcon"', 'from "../../../../assets/application-status/uploadAnnexureIcon"' | Set-Content $f
}

# Fix Popup assets
(Get-Content "src\widgets\Popup\Popup.jsx") `
    -replace 'from\s+"\.\.\/\.\.\/assets\/Frame 1410092371\.svg"', 'from "../../assets/application-status/Frame 1410092371.svg"' `
    -replace 'from\s+"\.\.\/\.\.\/assets\/iconamoon_close\.svg"', 'from "../../assets/application-status/iconamoon_close.svg"' |
    Set-Content "src\widgets\Popup\Popup.jsx"

# Fix missing component paths (components that may be in different locations)
# The college confirmation form components that don't exist - these imports need to be updated to existing files or created

Write-Host "Path fixes complete!"
