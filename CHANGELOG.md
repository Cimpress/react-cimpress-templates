# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.5.2] - 2018-07-20
### Fixed
- Moved react and @cimpress/react-components as peer dependencies 

## [0.5.0] - 2018-07-20
### Changed
- Change the object passed as an argument to props.onChange() to a plain fulfiller object
### Fixed
- Fix component not firing props.onChange() in certain cases
- Refresh list of fulfillers together with list of recently selected fulfillers when new props.accessToken is passed

## [0.4.5] - 2018-07-16
### Added
- Support recent fulfillers for TemplateSelector component

## [0.3.1] - 2018-06-05
- Update cimpress-fulfiller-identity package to address an issue preventing minifying

## [0.3.0] - 2018-06-05
- Added TemplateSelector component with support for calling Fulfiller Identity and Fulfillment Location services
- Added language property (defaulting to 'eng') to all components

## [0.2.0] - 2018-05-16
Simplified and renamed.

## [0.1.0] - 2017-11-20
### Added
- FulfillmentLocationItem component
- FulfillmentLocationList component
