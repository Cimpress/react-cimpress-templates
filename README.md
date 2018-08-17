# react-cimpress-templates
React components to help selecting Cimpress templates

## Overview 

    TBD

## Usage

Install the package:
    
    npm install --save react-cimpress-templates

  
Add to your code

    TBD
        

## Development

1. Clone the repository
    
        git clone https://github.com/Cimpress/react-cimpress-templates
        
2. Ensure you have the following environment variables set. These are used to get Auth0 token to be able to 
download the translations files in the next step.
    
        export CLIENT_ID=<...>
        export CLIENT_SECRET=<...>
        
3. Run the following command to download the language translations files. 
        
        npm run build

4. For developing, we use [Storybook](https://github.com/storybooks/storybook). You can run and see
the stories with:
        
        npm run storybook
        
5. Make sure your code passes the linting rules
        
        npm run code-check
        
6. Make sure to update **package.json** with the new version of the package (please follow 
[semantic versioning](https://semver.org/). After, please also update **CHANGELOG.md** file 
with short info for the changes in this new version.   

7. Don't forget to enjoy!