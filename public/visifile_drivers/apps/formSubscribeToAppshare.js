function(args) {
/*
created_timestamp(-1)
base_component_id("form_subscribe_to_appshare")
display_name("Form to subscribe to Appshare")
is_app(true)
load_once_from_file(true)
visibility("PUBLIC")
description('Form to subscribe to Appshare')
editors_old(["form_editor_component"])
read_only(true)
logo_url("https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/yWLXB1Z/videoblocks-youtube-subscribe-button-subscribe-animations_bbfp0u_if_thumbnail-full05.png")
formEditor(
{
    next_id: 5,

    fields: [
        {id: 1, type: "text",   text: "Subscribe to the Appshare newsletter" },

        {id: 2, type: "input",  label: "name" },
        {id: 3, type: "input",  label: "address" },
        {id: 4, type: "input",  label: "DOB" }
    ]
})//formEditor
*/

    //** gen_start **//
    Vue.component('form_subscribe_to_appshare', {
      template: `<div>
                    <template v-if='!subscribed'>
                            <div class="form-group">
                                <div class='text-center' style='font-weight:bold;padding-bottom: 10px;'>Subscribe to the Appshare newsletter</div>
                                <input id=add placeholder="email address" type="email" class='form-control' v-model="email_address" style='margin-bottom: 10px;'></input>
                                <button class="btn btn-info btn-block" v-on:click='insert_email(email_address)'>Subscribe</button>
                            </div>
                    </template>
                    <template v-if='subscribed' >
                        <div class='text-center' style='font-weight:bold;padding-bottom: 10px;'>
                            Thanks for subscribing to the Appshare newsletter {{email_address}}!
                        </div>
                    </template>
                </div>
       `
      ,


    data: function() {
        return {
                    apps: [],
                    email_address: "",
                    subscribed: false
                }},

      mounted: async function() {
      },
      methods: {
           insert_email: async function(email) {
                await sql( "insert into users (id, email, when_created) values (?,?,?)"
                            ,
                            [  uuidv4(),  email  ,  new Date().getTime() ])
                this.subscribed = true

            }
      }
    })
    //** gen_end **//

    /*
    sqlite(
    [
        "Create the initial users table to store the email addresses",
        [
            "CREATE TABLE users (id	TEXT, email	TEXT, when_created INTEGER);"
        ]

    ])//sqlite

   */
}
