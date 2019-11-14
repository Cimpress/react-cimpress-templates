#### Package deprecation notice

As of 2019-11-14, the team is deprecating this component library because of a newly emergent reliance on internally published libraries. With this in mind, the package has been renamed and published internally. All further development of this library, including new features and bug fixes, will continue in the new repository. Thus, this repository will no longer be maintained.

You are welcome to migrate to `@cimpress-technology/react-cimpress-templates`, sourcing it from the internal repository.

##### What will happen if I do nothing?

You will be using an unmaintained version of the library, which means that no support will be offered.

##### I am an external user without access to the internal repository. What can I do?

Unfortunately, at the time we are unable to provide you with a replacement component library. You may continue using the unmaintained library, albeit at your own risk.

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
            
* Using template preview
        <TemplatePreview
                accessToken={auth.getAccessToken()}
                templateId={store.get('lastTemplateId')}
                payload={jsonPayload}
                materializationLanguage={'xml'}       
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
