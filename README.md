# react-cimpress-templates
React components to help selecting Cimpress templates

## Overview 

The purpose of this component is to facilitate integration of Cimpress templates selection in your application.


## Usage

Install the package:
    
    npm install --save react-cimpress-templates

  
Depending on your use case, you can add the following:

* Using extended template item / field

        <TemplateItem
                /* Component language */
                language={'eng'}
                
                /* Auth0 access token required to make service calls to retrieve data */
                accessToken={auth.getAccessToken()}
                
                /* The template to show (selected, active, etc...) */
                templateId='9318-231-723-61823'

                /* Callback to be called when the current template is changed by user */
                onTemplateChanged={(templateId) => {
                    // do something
                }}

                /* Callback to be called a new template is created by user */
                onTemplateCreated={(newTemplateId) => {
                    // do something
                }}

                /* Filter only templates having specific tag key (eg. urn:fileBasedAdaptor:template) */
                filterTemplatesByTag='urn:fileBasedAdaptor:template',
 
                /* Automatically assign the `filterTemplatesByTag` tag when creating a new template */    
                autoTagTemplateWhenCreating={true},
                
                /* Automatically grant read permission to newly created templates for a fixed principal */
                autoGrantReadToPrincipalWhenCreating={principal}
                                
                /* Automatically redirect to Template Designer when a new template is created */
                autoRedirectAfterCreation={true}
                
                /* JSON that should be forwarded to Template Desinger when editing a template */
                payload={payloadData}
                
                /* A handler to call when preview button is clicked */
                onPreviewClicked={(templateId) => { doSomething() }}

                /* The following properties define whether the respective buttons should be shown */
                withCreateBlankButton={true}
                withComments={true}
                withAccessButton={true}
                withEditButton={true}
                withCloneButton={true}
                withPreviewButton={false}
            />


* Using standard template selection

        <TemplatesSelect
                accessToken={auth.getAccessToken()}
                selectedTemplateId={store.get('lastTemplateId')}
                onChange={templateId => store.set({ lastTemplateId: templateId })}/>

* Using a button to open a modal with template selection 
        
        <TemplatesSelectButton
                accessToken={auth.getAccessToken()}
                onConfirm={templateId => store.set({ lastTemplateId: templateId })}/>

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
