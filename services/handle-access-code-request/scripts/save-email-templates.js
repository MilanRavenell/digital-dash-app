const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');

const sesClient = new AWS.SES({ region: 'us-west-2', apiVersion: 'latest' });

const templates_dir_path = 'email-templates' ;

// Run this after changes are made to email-templates to create/update templates in AWS
(async function() {
    const templates = (await sesClient.listTemplates().promise())
        .TemplatesMetadata
        .map(({ Name }) => Name);

        console.log(templates)

    fs.readdir(templates_dir_path, async (err, files) => {
        if (err) {
            console.error('Failed to get templates json files', err);
            return;
        }

        await Promise.all(files.map(async (template_json_file) => {
            const template_path = path.join(templates_dir_path, template_json_file);

            fs.readFile(template_path, 'utf8', async (err, data) => {
                if (err) {
                    console.error(`Failed to open template ${template_path}`, err);
                    return;
                }

                const template = JSON.parse(data);
                if (templates.includes(template.Template.TemplateName)) {
                    console.log(`Updating template ${template_path}`);
                    await sesClient.updateTemplate(template).promise();
                    return;
                }

                console.log(`Creating template ${template_path}`);
                await sesClient.createTemplate(template).promise();
            });
        }));
    });
})();