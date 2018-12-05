# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.3.6] - 2018-12-06
### Changed
- Do not use reactI18nextModule from react-i18next 

## [0.3.5] - 2018-12-05
### Changed
- Start using a dedicated COAM client to reduce code complexity.

## [0.3.4] - 2018-12-03
### Fixed
- Updated dependencies to fix minor issue when granting permissions to a new user

## [0.3.3] - 2018-11-28
### Changed
- Updated dependencies

## [0.3.2] - 2018-11-27
### Changed
- Benefit from new Stereotype's API. Reduced calls being made when creating a template. Removed hardcoded template URLs.

## [0.3.1] - 2018-11-26
### Added
- Added better error handling for TemplatePreview component
- Updated react-cimpress-users dependency

## [0.3.0] - 2018-11-23
### Added
- Added initial version of TemplatePreview component

## [0.2.2] - 2018-11-21
### Changed
- Updated preview icon

## [0.2.1] - 2018-11-21
### Fixed
- Including public templates for selection
- Add 'onPreviewClicked' property for TemplateItem component

## [0.2.0] - 2018-11-15
### Changed
- New interface! Checkout the readme
- Integrate with Tagliatelle service to better handle template names
- Integrate with Tagliatelle service to not rely on naming convention anymore
- Add ability to automatically grant read access to newly created templates for specific user

## [0.1.3] - 2018-11-02
### Fix
- Add missing dependency `react-virtualized-select`

## [0.1.2] - 2018-10-31
### Changed
- Updated react-cimpress-users version

## [0.1.0] - 2018-10-10
### Added
- Added TemplateItem component

## [0.0.2] - 2018-08-03
### Added
- Initial version that contains TemplateSelect, TemplateSelectButton & TemplateSelectModal 
