(() => {

    const DATA = [
        {
            topic:"Permissions to Standard Objects, Custom Objects, and Fields",
            select:1,
            prompt:"Universal Containers uses 75,000 distributors that have close to 1 million total users. Distributors need to use the community to see closing opportunities assigned to their distributor for delivery. What license recommendation will meet distributor needs?",
            options:[
                {k:"A", t:"Customer Community"},
                {k:"B", t:"Customer Community Plus"},
                {k:"C", t:"Sales Cloud"},
                {k:"D", t:"Partner Community"}
            ],
            correct:["D"],
            explanation:
`**Why D is right.** The requirement is that external distributor users see opportunities, and the Opportunity object is only available on the partner-style Experience Cloud licenses. Partner Community is built for business-to-business relationships where external users work with sales data such as leads, opportunities and campaigns. It also supports roles and advanced sharing, so each distributor's users can be limited to the opportunities assigned to their own distributor account instead of the whole pipeline.

**Why A is wrong.** Customer Community is a business-to-consumer license for large numbers of external users. It has no access to the Opportunity object and no roles, so it cannot show distributors their closing opportunities.

**Why B is wrong.** Customer Community Plus adds roles, reports, dashboards and advanced sharing on top of Customer Community, but it still does not include the Opportunity object. Better sharing doesn't help when the object itself isn't available to the license.

**Why C is wrong.** Sales Cloud is an internal user license meant for the company's own employees, not a community license. It isn't the right way to give a million external distributor users access through a community, and it would be far more expensive than a community license.`,
            sources:[
                {l:"Experience Cloud User Licenses — Salesforce Help", u:"https://help.salesforce.com/s/articleView?id=users_license_types_communities.htm&language=en_US&type=0"},
                {l:"Salesforce Experience Cloud – Licences Deep Dive — Salesforce Ben", u:"https://www.salesforceben.com/salesforce-experience-cloud-licences/"}
            ]
        },
        {
            topic:"Access to Other Data",
            select:2,
            prompt:"Sales Operations at Universal Containers (UC) has created Public Report and Dashboard folders for sales managers that report to the VP of Sales. Sales Operations currently spends a few hours each month updating users that should have access to edit items in these folders. In which two ways can UC grant access to sales managers to automate access to these Reports and Dashboards folders? (Choose two.)",
            options:[
                {k:"A", t:"Share the folders with the \"VP of Sales\" Role and Subordinates."},
                {k:"B", t:"Share the folders lowest roles in the Role Hierarchy, superiors will get access automatically."},
                {k:"C", t:"Share the folders with the \"Sales Managers\" Public Group."},
                {k:"D", t:"Share the folders with the \"Sales Managers\" Queue."}
            ],
            correct:["A","C"],
            explanation:
`**Why A is right.** Report and dashboard folders can be shared with a role or with a role and its subordinates. Sharing with the "VP of Sales" role and subordinates covers everyone in the branch below the VP, so a manager who is hired, promoted or moved within that branch gets access through their role, with no one editing the folder's sharing. Choose the Editor access level so they can edit the items in the folder.

**Why C is right.** Folders can also be shared with a public group. A "Sales Managers" group is shared with the folders once, and from then on Sales Operations only maintains the group's membership. The group can include roles or roles and subordinates, so its membership can follow the hierarchy too instead of being updated by hand.

**Why B is wrong.** Folder sharing does not roll up the role hierarchy the way record sharing does. Sharing a folder with the lowest roles does not give their superiors access, so the managers above them would still have to be added by hand.

**Why D is wrong.** The options for sharing a folder are users, public groups, roles, and roles and subordinates. Queues aren't among them. Queues are used to own records such as cases and leads, not to control access to folders.`,
            sources:[
                {l:"Analytics Folder Sharing cheat sheet — Salesforce Help", u:"https://resources.docs.salesforce.com/210/latest/en-us/sfdc/pdf/salesforce_analytics_folder_sharing_cheatsheet.pdf"},
                {l:"FolderShare — Metadata API Developer Guide", u:"https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_foldershare.htm"}
            ]
        },
        {
            topic:"Implications of Security Model Choice",
            select:1,
            prompt:"What advanced tool can Salesforce enable for large-scale role hierarchy realignments?",
            options:[
                {k:"A", t:"Set external Organization-Wide Default to Public Read Only"},
                {k:"B", t:"Granular locking"},
                {k:"C", t:"Partitioning by Divisions"},
                {k:"D", t:"Skinny Table Indexing"}
            ],
            correct:["B"],
            explanation:
`**Why B is right.** By default, Salesforce locks the entire group membership table whenever roles or groups change, to protect data integrity, which makes it impossible to process group changes in several threads. Granular locking lets multiple group maintenance operations run at the same time when the roles or groups involved have no hierarchical or other relationship. During a large realignment this speeds up the work and reduces "could not acquire lock" errors. Moving a role within the hierarchy still blocks almost all other group updates, so those moves need to be planned carefully.

**Why A is wrong.** The external organization-wide default sets the baseline record access for external users. It has nothing to do with how role hierarchy changes are processed, and changing a default is itself something that triggers sharing recalculation.

**Why C is wrong.** Divisions partition the data in very large orgs so that reports, list views and searches only scan a subset of records. They improve query and search performance, not the processing of role and group membership changes.

**Why D is wrong.** Skinny tables and indexes speed up queries and reports on large objects. They don't change how group membership is locked or recalculated when the role hierarchy is realigned.`,
            sources:[
                {l:"Group Membership Locking — Designing Record Access for Enterprise Scale", u:"https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_group_membership_locking.htm"},
                {l:"Tools for Large-Scale Realignments — Designing Record Access for Enterprise Scale", u:"https://developer.salesforce.com/docs/platform/draes/guide/draes-tools.html"}
            ]
        },
        {
            topic:"Access to Records",
            select:1,
            prompt:"By default, how many roles are created when the first external user is created on a partner account?",
            options:[
                {k:"A", t:"3"},
                {k:"B", t:"2"},
                {k:"C", t:"1"},
                {k:"D", t:"0"}
            ],
            correct:["C"],
            explanation:
`**Why C is right.** The account roles setting for partner accounts is 1 by default. When the first external user is created on a partner account, Salesforce creates that account's role, which with the default setting is a single "Partner User" role, and all the other users added to the same account share it. Roles are created per account and not per user, so a partner account with 50 users still has only one role under the default setting.

**Why A is wrong.** Three is the most you can configure per partner account (Executive, Manager and User). It isn't the default. An admin has to raise the setting under Setup > Digital Experiences > Settings to get a small role hierarchy inside each partner account.

**Why B is wrong.** Two (User and Manager) is also a value an admin can choose, not the default. Keep the default of one unless partners really need to share records up a hierarchy within their own account, since more roles can hurt performance.

**Why D is wrong.** External users on partner accounts do get a role. Salesforce creates the account's role when the first user is created and assigns the new users to it automatically.

**Note.** Raising the setting later doesn't add roles to partner accounts that already exist. Some older study material gives 3 as the default, but Salesforce's current documentation says 1.`,
            sources:[
                {l:"Set Up Account Roles and the Role Hierarchy — Trailhead", u:"https://trailhead.salesforce.com/content/learn/projects/communities_share_crm_data/account_roles_hierarchy"},
                {l:"Create a Partner Portal, Enable Partner Account and Users, and Add Members — Trailhead", u:"https://trailhead.salesforce.com/content/learn/projects/communities_share_crm_data/create_portal_and_users"}
            ]
        },
        {
            topic:"Access to Records",
            select:2,
            prompt:"The Finance team at Universal Containers usually does not need access to Account and Contact records. A finance analyst was temporarily given Opportunity access for a big deal to help with tax calculation. She can now also access Account and Contact records as well. Which two reasons could be causing this issue? (Choose two.)",
            options:[
                {k:"A", t:"Contact records can be accessed due to implicit sharing from Account."},
                {k:"B", t:"Account records can be accessed due to role hierarchy."},
                {k:"C", t:"Account records can be accessed due to implicit sharing from Opportunity."},
                {k:"D", t:"Contact records can be accessed due to implicit sharing from Opportunity."}
            ],
            correct:["A","C"],
            explanation:
`**Why C is right.** Salesforce builds in implicit sharing. Parent implicit sharing gives read-only access to the parent account to any user who has access to one of its child opportunities, cases or contacts. Once the analyst was given access to the opportunity, the system automatically gave her read access to the opportunity's account. Nobody shared the account with her directly.

**Why A is right.** The access to the account then carries on to the account's contacts. When contact sharing is controlled by the parent account, being able to read the account is what lets a user read its contacts. So the contacts become visible through the account access she gained, not through any sharing set up on the contacts. This is why a request for "just opportunity access" quickly spreads to the account and its contacts.

**Why B is wrong.** Role hierarchy gives users access to records owned by users below them in the hierarchy. The scenario says she was given opportunity access, and nothing says her role was changed or that she sits above the account owners, so the hierarchy doesn't explain it.

**Why D is wrong.** Implicit sharing from an opportunity only reaches the parent account, as read-only access. It doesn't go from the opportunity straight to the contacts. Contacts become visible only through the account.`,
            sources:[
                {l:"Implicit Sharing — Designing Record Access for Enterprise Scale", u:"https://developer.salesforce.com/docs/platform/draes/guide/draes-object-relationships-implicit-sharing.html"}
            ]
        },
        {
            topic:"Access to Other Data",
            select:1,
            prompt:"Universal Containers keeps product brochures in Salesforce as files. Sarah shares a public link to a product brochure with potential customers during a meeting. She wants to ensure they do not have access to the file after the meeting. How should Sarah accomplish this?",
            options:[
                {k:"A", t:"Delete the public link."},
                {k:"B", t:"Move the file to another folder."},
                {k:"C", t:"Delete the file."},
                {k:"D", t:"Rename the file."}
            ],
            correct:["A"],
            explanation:
`**Why A is right.** A public link is a separate, encrypted URL that gives anyone who has it access to the file. Deleting the link (in Lightning Experience, open the file's Public Link and click the trash can) means it no longer provides access to the file, so the potential customers lose access. The brochure itself stays in Salesforce, and Sarah can create a new link for the next meeting.

**Why B is wrong.** The public link points to the file itself, not to where it's stored. Moving the file to another folder or library doesn't change the link, so the customers could still open it.

**Why C is wrong.** Deleting the file would also stop the link from working, but it removes the brochure from Salesforce, which UC uses and wants to keep. It's a heavy-handed fix when deleting the link does the same job and keeps the file.

**Why D is wrong.** Renaming the file only changes its title. The public link is unaffected, and the customers would still have access.`,
            sources:[
                {l:"Share Files Via Link — Salesforce Help", u:"https://help.salesforce.com/s/articleView?language=en_US&id=experience.collab_files_sharing_via_link.htm&type=5"},
                {l:"Delete a File — Salesforce Help", u:"https://help.salesforce.com/s/articleView?id=sf.collab_files_deleting.htm&language=en_US"}
            ]
        },
        {
            topic:"Access to Records",
            select:1,
            prompt:"Universal Containers' organization wide-defaults model is private for the Account object. A sales representative user has Create/Edit access to opportunity records. Which level of access will the sales rep have to the related account record?",
            options:[
                {k:"A", t:"Read/Create/Edit access"},
                {k:"B", t:"No access"},
                {k:"C", t:"Read/Create access"},
                {k:"D", t:"Read-only access"}
            ],
            correct:["D"],
            explanation:
`**Why D is right.** Salesforce has built-in implicit sharing. Parent implicit sharing gives read-only access to the parent account to any user who has access to one of its child opportunities, cases or contacts. Even though the Account default is Private and the rep doesn't own the account, having access to the opportunity gives her read-only access to its account. Her Create/Edit access on the opportunity doesn't carry over to the account.

**Why A is wrong.** Edit access to the account would have to come from somewhere else: owning the account, a role above the owner, an account sharing rule, an account team, or manual sharing. Access to a child opportunity gives none of these.

**Why B is wrong.** With a Private default and no other sharing, she would have no access to the account. But the implicit parent share created by her opportunity access gives her read access to it.

**Why C is wrong.** Sharing grants Read Only or Read/Write (and Full Access for some objects). "Read/Create" isn't a sharing access level. The ability to create records comes from object permissions on the profile or permission sets, not from sharing.`,
            sources:[
                {l:"Implicit Sharing — Designing Record Access for Enterprise Scale", u:"https://developer.salesforce.com/docs/platform/draes/guide/draes-object-relationships-implicit-sharing.html"}
            ]
        },
        {
            topic:"Permissions to Standard Objects, Custom Objects, and Fields",
            select:2,
            prompt:"The Corporate Identity and Access Team needs to audit User Setup in the Salesforce Org. What two permissions should be granted to this team so they can perform their audit? (Choose two.)",
            options:[
                {k:"A", t:"View All Users"},
                {k:"B", t:"View Setup and Configuration"},
                {k:"C", t:"View permission on the User object"},
                {k:"D", t:"View All Data"}
            ],
            correct:["A","B"],
            explanation:
`**Why A is right.** To audit user setup, the team has to be able to see every user record. When user visibility is restricted by User Sharing (for example the organization-wide default for users is Private), people can only see themselves and their subordinates. The "View All Users" permission gives Read access to all user records regardless of the sharing settings, without making the auditors administrators.

**Why B is right.** The user setup pages (users, profiles, permission sets, roles and so on) live in Setup. "View Setup and Configuration" lets someone open the Setup menu and the administrative settings pages and see how things are configured, without being able to change them. That is exactly what an auditor needs. It is also the permission required to view the Setup Audit Trail, which logs recent setup changes (who changed what and when), including changes to users, roles and permission sets.

**Why C is wrong.** Visibility of user records isn't granted through a regular object permission on the User object. It is controlled by User Sharing, and "View All Users" is the permission that opens up that visibility.

**Why D is wrong.** "View All Data" gives Read access to every record of every object in the org. That is far more than an audit of user setup requires and goes against least privilege, and it doesn't give them access to the Setup pages anyway.`,
            sources:[
                {l:"Understanding User Sharing — Salesforce tip sheet", u:"https://resources.docs.salesforce.com/242/latest/en-us/sfdc/pdf/salesforce_sharing_users_tipsheet.pdf"},
                {l:"User Profile permission descriptions — Salesforce Help", u:"https://help.salesforce.com/apex/HTViewSolution?id=000198725"},
                {l:"Monitor Setup Changes with Setup Audit Trail — Salesforce Help", u:"https://help.salesforce.com/s/articleView?id=sf.admin_monitorsetup.htm&type=5"}
            ]
        },
        {
            topic:"Access to Records",
            select:1,
            prompt:"Universal Containers (UC) is implementing Sales Cloud. During the last quarter of the financial year, sales agents help each other close deals. They requested a solution in Salesforce to allow them to specify an assistant agent on the opportunity record. When the sales agent changes the assistant field, the system should automatically remove access from the previous assistant and grant access to the new assistant. What is the optimum solution to meet the requirements?",
            options:[
                {k:"A", t:"Use Opportunity Team and create an assistant field, use Apex to share Opportunities with the Assistant Agent."},
                {k:"B", t:"Use Apex Sharing to share and unshare opportunities with the Assistant Agent."},
                {k:"C", t:"Use Sharing Rule to share Opportunities with the Assistant Agent."},
                {k:"D", t:"Use Share group to share Opportunities with the Assistant Agent."}
            ],
            correct:["B"],
            explanation:
`**Why B is right.** The person who needs access is chosen record by record, in a user field on the opportunity, and it changes during the quarter. Declarative tools can't follow a user field like that, so the access has to be maintained programmatically. Apex managed sharing is built for this: a trigger (or flow-invoked Apex) on the opportunity creates a share record for the new assistant and deletes the one for the previous assistant whenever the field changes. Salesforce's own example does the same thing, granting access to the users named in lookup fields (a hiring manager and a recruiter) on the record.

**Why A is wrong.** Opportunity Team members are added and removed by people, and the team doesn't read a custom assistant field. Apex would still be needed to keep the share records in sync, so the team and the extra field add complexity without solving the problem.

**Why C is wrong.** A sharing rule grants access to a public group, role or territory, based on record ownership or field criteria. It can't share a record with whichever individual user is named in a field on that record, and it won't automatically revoke access when that user is replaced.

**Why D is wrong.** There is no "share group" feature that grants record access based on a field value. Groups are static collections of users and still need something else to decide who gets access to which opportunity.`,
            sources:[
                {l:"Sharing a Record Using Apex — Apex Developer Guide", u:"https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_bulk_sharing_creating_with_apex.htm"},
                {l:"Understanding Sharing — Apex Developer Guide", u:"https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_bulk_sharing_understanding.htm"}
            ]
        },
        {
            topic:"Access to Records",
            select:1,
            prompt:"Universal Containers (UC) has a partner community for its 200 distributors. UC customer accounts are assigned an individual distributor. The organization-wide default setting for the custom Delivery object is private. How can an architect advise UC to grant all users at a distributor access to delivery records for all customers assigned to a particular distributor?",
            options:[
                {k:"A", t:"Create a criteria-based Sharing Rule that shares delivery records matching a distributor to the Distributor role in the role hierarchy."},
                {k:"B", t:"Create a criteria-based Sharing Rule that shares delivery records matching the Distributor to users of a Public Group created for the distributor."},
                {k:"C", t:"Give ownership of the delivery record to a distributor user."},
                {k:"D", t:"Create a Sharing Set for the Distributor Profile to grant access to the Delivery Object."}
            ],
            correct:["A"],
            explanation:
`**Why A is right.** Partner Community users have roles. When the first partner user is created on a partner account, Salesforce automatically creates a portal role for that account, and every user at that distributor sits in it. A criteria-based sharing rule can match each delivery record to its distributor (the distributor value on the record) and share it with that distributor's role, so every user at the distributor gets access. Sharing rules work the same way for external users as for internal ones, and criteria-based rules don't depend on who owns the record.

**Why B is wrong.** A public group per distributor would mean building and maintaining 200 groups and keeping each one's membership current as partner users join and leave. The distributor's role already contains exactly those users, so the groups add upkeep for nothing.

**Why C is wrong.** A record has a single owner. Making one distributor user the owner doesn't give the other users at that distributor access, and ownership has to be maintained on every record.

**Why D is wrong.** Sharing sets are built for high-volume users (Customer Community and similar licenses), which don't have roles and so don't use the role-based sharing model. Partner Community users have roles, so they are handled with sharing rules instead.`,
            sources:[
                {l:"Use Sharing Rules for External Users — Trailhead", u:"https://trailhead.salesforce.com/content/learn/projects/communities_share_crm_data/sharing_rules"},
                {l:"Use Site-Specific Sharing (sharing sets) — Trailhead", u:"https://trailhead.salesforce.com/content/learn/projects/communities_share_crm_data/external_user_sharing"},
                {l:"Platform Sharing Architecture — Salesforce Architects", u:"https://architect.salesforce.com/fundamentals/platform-sharing-architecture"}
            ]
        },
        {
            topic:"Access to Records",
            select:1,
            prompt:"The architect has a requirement to create a criteria-based sharing rule based on the customer Social Security number. However, when setting up the rule in Contact Sharing, the field is not shown on the list of available fields. What might cause this?",
            options:[
                {k:"A", t:"Text Fields with Validation Rules are not available for Sharing Rules."},
                {k:"B", t:"The Architect's Profile does not have Field Level Security (FLS) for this field."},
                {k:"C", t:"The Field has been configured for encryption."},
                {k:"D", t:"The Architect does not have the permission to Compliance Fields."}
            ],
            correct:["C"],
            explanation:
`**Why C is right.** Encrypted fields can't be used in criteria-based sharing rules. Salesforce states that currently or previously encrypted custom fields can't be used in criteria-based sharing rules (or in custom formula fields). A Social Security number is exactly the kind of field an organization encrypts, and once it is encrypted it no longer appears among the fields you can pick when you build the rule.

**Why A is wrong.** Validation rules don't affect whether a field can be used as sharing rule criteria. Text fields are supported in criteria-based sharing rules, whether or not they have validation rules.

**Why B is wrong.** The limitation comes from the field itself being encrypted, not from the architect's personal field-level security. Giving the architect more access to the field would not make an encrypted field eligible as sharing rule criteria.

**Why D is wrong.** The reason the field is missing is a platform restriction on encrypted fields, not a user permission. "Permission to Compliance Fields" is not the setting that decides which fields a criteria-based sharing rule can use.`,
            sources:[
                {l:"Which Fields Can I Encrypt? — Shield Platform Encryption, Salesforce Security Guide", u:"https://developer.salesforce.com/docs/atlas.en-us.204.0.securityImplGuide.meta/securityImplGuide/security_pe_overview_fields.htm"},
                {l:"Criteria-Based Sharing Rules — Salesforce Security Guide", u:"https://developer.salesforce.com/docs/atlas.en-us.216.0.securityImplGuide.meta/securityImplGuide/security_sharing_cbs_about.htm"}
            ]
        },
        {
            topic:"Access to Records",
            select:1,
            prompt:"What should a Salesforce architect recommend to make sure that users that gained access to a custom object record through Apex managed sharing do not lose access to it when its owner is changed?",
            options:[
                {k:"A", t:"Use \"With Sharing\" Keyword to make sure record visibility will be considered."},
                {k:"B", t:"Create a specific Apex Sharing Reason for the custom Object."},
                {k:"C", t:"Create a new record in -Share Object with RowCause \"Manual\"."},
                {k:"D", t:"Use \"runAs\" system method in Apex Classes to enforce visibility."}
            ],
            correct:["B"],
            explanation:
`**Why B is right.** Apex managed sharing requires an Apex sharing reason: the share record is created with a custom row cause that the developer defines on the custom object. Share records that carry an Apex sharing reason are kept when the record owner changes or is deactivated, which is what the requirement asks for. Sharing reasons can be created in the UI for custom objects, so this fits a custom object.

**Why A is wrong.** The "with sharing" keyword only makes a class enforce the sharing rules of the current user when it runs. It doesn't create share records and doesn't protect existing ones from being removed when the owner changes.

**Why C is wrong.** A share record with the row cause "Manual" is user managed (manual) sharing, not Apex managed sharing. Manual shares are deleted automatically when the record owner changes, so the users would lose access, which is exactly the problem to avoid.

**Why D is wrong.** The runAs method is for test methods. It lets a test run code as a given user so that user's sharing and permissions are enforced during the test. It has no effect on production sharing records or on what happens when an owner changes.`,
            sources:[
                {l:"Sharing a Record Using Apex — Apex Developer Guide", u:"https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_bulk_sharing_creating_with_apex.htm"},
                {l:"Understanding Sharing — Apex Developer Guide", u:"https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_bulk_sharing_understanding.htm"},
                {l:"Enforce Sharing Rules — Apex Developer Guide", u:"https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/pages/apex_security_sharing_rules.htm"},
                {l:"Using the runAs Method — Apex Developer Guide", u:"https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/pages/apex_testing_tools_runas.htm"}
            ]
        },
        {
            topic:"Access to Records",
            select:1,
            prompt:"The sales managers at Universal Containers (UC) requested their teams to define each user's role on their accounts in order to provide an easy way to establish accountability and collaboration. Sales managers also requested that sales associates should only get the following permissions: Read access to the accounts. Read access to cases related to the accounts. No access to deals related to the accounts. The sales associates may be granted access to opportunities when needed. Assuming the overall sharing model of the organization is private and no sharing rules are configured on the account object. How can an Architect achieve these requirements?",
            options:[
                {k:"A", t:"Use Account Teams to define access to Accounts as well as Opportunities and Cases related to Accounts."},
                {k:"B", t:"Use Account Teams, Opportunity Teams, and Case Teams."},
                {k:"C", t:"Use Account Teams and use Sharing Rules to share Cases with Sales Associates. No change required to the Opportunity Object."},
                {k:"D", t:"Use Account Teams, Case Teams. No configuration required for the Opportunity Object."}
            ],
            correct:["A"],
            explanation:
`**Why A is right.** An Account Team lets each team member have a defined role on the account, which meets the accountability requirement. The same team also sets the member's level of access to the account and to related records such as opportunities and cases. So one Account Team can give sales associates Read on the account, Read on its cases and no access to its opportunities, and the opportunity access can be raised later for a particular associate when it is needed. Everything is managed in one place.

**Why B is wrong.** Opportunity Teams and Case Teams work record by record. Adding them means people have to build a team on every opportunity and every case, when the Account Team already controls access to those related records for the whole account.

**Why C is wrong.** The sharing rules aren't needed. The Account Team already provides the Read access to cases, and a sharing rule gives access by role or group instead of by each person's role on a specific account. Leaving the Opportunity object unchanged also gives no simple way to open opportunities to an associate when needed.

**Why D is wrong.** Case Teams are built per case, so they would have to be added to every case, when the Account Team can already set the case access for the account. Not configuring anything for opportunities also leaves no easy way to grant an associate access to the opportunities of an account when needed.`,
            sources:[
                {l:"Sell as a Team (Account Teams) — Trailhead", u:"https://trailhead.salesforce.com/content/learn/modules/sales-team-collaboration/sell-as-a-team"},
                {l:"AccountTeamMember — Object Reference", u:"https://developer.salesforce.com/docs/atlas.en-us.218.0.api.meta/api/sforce_api_objects_accountteammember.htm"}
            ]
        },
        {
            topic:"Access to Records",
            select:1,
            prompt:"Universal Containers (UC) has implemented Customer Community with customer community plus licenses for its distributors. Some distributors requested granting specific community users (agents) to view cases submitted by other agents of the same distributor. Which feature only supports these requirements?",
            options:[
                {k:"A", t:"Permission Set to grant Community Admin Permission"},
                {k:"B", t:"Delegate External User"},
                {k:"C", t:"Partner Community Admin"},
                {k:"D", t:"Partner Super User"}
            ],
            correct:["D"],
            explanation:
`**Why D is right.** Super user access is the feature built for this. It lets specific users in an account see records owned by other community users of the same account (cases, opportunities, leads and custom objects), including users in lower roles, without opening those records to everyone. It is available for Partner Community and Customer Community Plus licenses. For Customer Community Plus users it is given through the "Portal Super User" permission (for example in a permission set), so only the chosen agents get the wider visibility.

**Why A is wrong.** A community admin permission is about administering the community itself, not about seeing other users' cases. It is far broader than what the distributors asked for.

**Why B is wrong.** Delegated external user administration lets a designated user manage other external users of the account (for example creating users or resetting passwords). It is about administering users, not about record access.

**Why C is wrong.** "Partner Community Admin" is not a standard Salesforce feature for sharing records.`,
            sources:[
                {l:"Sharing within Salesforce communities (partner and customer super user access)", u:"https://ibooks.qq.com/read/1036698362/44"},
                {l:"Delegated External User Administration — Salesforce Help", u:"https://help.salesforce.com/HTViewHelpDoc?id=networks_DPUA.htm"}
            ]
        },
        {
            topic:"Access to Records",
            select:2,
            prompt:"Universal Containers (UC) uses a custom Lightning component with an Apex class to display shipment information (custom object, private OWD). UC sales managers are complaining about two important points: Shipment records that belong to their teams can be seen by other users. Shipment amount should be visible only by managers, but sales reps are able to view it. Which two features did the development team miss that is causing the problems? (Choose two.)",
            options:[
                {k:"A", t:"Use isSearchable keyword in Apex classes to assure record visibility."},
                {k:"B", t:"Use With Sharing keyword in Apex classes to enforce sharing rules evaluation."},
                {k:"C", t:"Use runAs in test class to enforce user permissions and field-level permissions."},
                {k:"D", t:"Use isAccessible() method in Apex classes to check field accessibility."}
            ],
            correct:["B","D"],
            explanation:
`**Why B is right.** Apex normally runs in system context, so the current user's sharing rules aren't applied unless the class asks for them. Declaring the class with the "with sharing" keyword makes it enforce record-level security, so users only get the shipment records they are allowed to see. That fixes the first complaint, records of a team being visible to other users, even though the object's organization-wide default is private.

**Why D is right.** Lightning components don't enforce field-level security on their own, and the "with sharing" keyword doesn't enforce it either. The Apex class has to check field accessibility itself, for example with the isAccessible() method on the field's describe result, before returning the shipment amount. With that check and the right field-level security on the field, sales reps no longer get the amount and only managers do. That fixes the second complaint.

**Why A is wrong.** isSearchable is a describe method that tells you whether an object can be searched by the current user. It isn't a keyword, and it doesn't control which records or fields a user can see.

**Why C is wrong.** The runAs method can only be used in test methods, to run a test as a given user. It doesn't enforce permissions in the production code, which is where the problem is.`,
            sources:[
                {l:"Securing Data in Apex Controllers — Lightning Aura Components Developer Guide", u:"https://developer.salesforce.com/docs/atlas.en-us.214.0.lightning.meta/lightning/apex_crud_fls.htm"},
                {l:"Secure Apex Classes — Lightning Web Components Developer Guide", u:"https://developer.salesforce.com/docs/platform/lwc/guide/apex-security"},
                {l:"Using the runAs Method — Apex Developer Guide", u:"https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/pages/apex_testing_tools_runas.htm"}
            ]
        },
        {
            topic:"Implications of Security Model Choice",
            select:1,
            prompt:"Universal Containers (UC) is a non-profit organization and has over 20,000,000 members (donors). The company decided to assign those accounts to Donations Reps based on their regions. Donations Reps ended up owning over 50,000 donors each. The donation reps started to see significant degradation of the system performance. What could be the reason for this problem?",
            options:[
                {k:"A", t:"The Donations Reps access to the assigned accounts."},
                {k:"B", t:"The Account (donor) object OWD is Private."},
                {k:"C", t:"There is an Account ownership data skew problem."},
                {k:"D", t:"Salesforce sharing recalculation kicked off."}
            ],
            correct:["C"],
            explanation:
`**Why C is right.** Ownership data skew is when a single user owns more than 10,000 records of an object. Each Donations Rep owns over 50,000 accounts, five times that threshold. When that much data is concentrated in one owner, any change that affects sharing (a record changing owner, the user moving in the role hierarchy, a change to a group or sharing rule involved) forces Salesforce to adjust a very large number of entries in the sharing tables. That is slow and shows up as degraded performance. Spreading the accounts across more owners, or giving the heavy owners no role (or a role at the top of the hierarchy), reduces the problem.

**Why A is wrong.** Owning records and having access to them is how the model is supposed to work. The problem is how much data a single owner holds, not the fact that the reps have access to their assigned accounts.

**Why B is wrong.** A Private default is a normal setting and not the root cause. The slowdown comes from the concentration of ownership. With the same ownership pattern, it is the heavy sharing maintenance that hurts.

**Why D is wrong.** A sharing recalculation is a consequence, not the underlying cause. Ownership skew is what makes those recalculations long-running and costly.`,
            sources:[
                {l:"Ownership Data Skew — Designing Record Access for Enterprise Scale", u:"https://developer.salesforce.com/docs/atlas.en-us.draes.meta/draes/draes_group_membership_data_skew.htm"},
                {l:"Architect Salesforce Record Ownership Skew for Peak Performance — Salesforce Developers Blog", u:"https://developer.salesforce.com/blogs/2012/06/architect-salesforce-record-ownership-skew-for-peak-performance-in-large-data-volume-environments"}
            ]
        },
        {
            topic:"Access to Records",
            select:1,
            prompt:"What vulnerability can exist when controllers use dynamic rather than static queries and bind variables?",
            options:[
                {k:"A", t:"Buffer Overflow Attacks"},
                {k:"B", t:"Record Access Override"},
                {k:"C", t:"SOQL Injection"},
                {k:"D", t:"Cross-site scripting"}
            ],
            correct:["C"],
            explanation:
`**Why C is right.** SOQL injection takes user-supplied input and uses it to build a dynamic SOQL query. If the input isn't validated, it can contain SOQL that changes the query and makes the application do something the developer never intended, such as returning records or fields the user shouldn't see. Because Apex queries run in system mode, an injection can effectively bypass the user's CRUD and field-level security. Static queries with bind variables avoid the problem, because user input is treated only as a value and can't change the structure of the query. If dynamic SOQL can't be avoided, the input has to be sanitized, for example with escapeSingleQuotes.

**Why A is wrong.** A buffer overflow comes from writing beyond a memory buffer, which has nothing to do with how a query is built from user input.

**Why B is wrong.** "Record Access Override" is not a recognized vulnerability tied to dynamic queries.

**Why D is wrong.** Cross-site scripting is about untrusted input being rendered in a page and run as script in the user's browser. It is a different attack, with different defenses, from altering a query.`,
            sources:[
                {l:"SOQL Injection — Apex Developer Guide", u:"https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexref/pages_security_tips_soql_injection.htm"},
                {l:"SOQL Injection Due to Insecure Database Query Construction — Packaging Guide", u:"https://developer.salesforce.com/docs/atlas.en-us.packagingGuide.meta/packagingGuide/secure_code_violation_soql_injection.htm"},
                {l:"SQL Injection — Secure Coding Guide", u:"https://developer.salesforce.com/docs/atlas.en-us.258.0.secure_coding_guide.meta/secure_coding_guide/secure_coding_sql_injection.htm"}
            ]
        },
        {
            topic:"Implications of Security Model Choice",
            select:2,
            prompt:"Universal Containers has a large network of partners, who each have seasonal workers that need short-term access to the community. How might the Architect design the solution to federate user setup to the Partners? (Choose two.)",
            options:[
                {k:"A", t:"Assign delegated external administrators at each partner."},
                {k:"B", t:"Grant the Modify Users permission to the partner managers."},
                {k:"C", t:"Create a permission set giving Read/Write to the User object to partner manager."},
                {k:"D", t:"Allow external users to self register."}
            ],
            correct:["A","D"],
            explanation:
`**Why A is right.** Delegated external user administration lets a designated user at each partner manage the external users of their own account. The administrator can only manage users under the same account and with the profiles the admin chose to delegate, so the partner can enable or disable users and reset passwords itself without anyone at UC being involved. That moves the setup of seasonal workers to the partners.

**Why D is right.** With self-registration, the seasonal workers can sign up on the community themselves, and Salesforce creates the user and contact from what they enter. UC and the partner don't have to create each short-term user by hand. Use a custom profile for this, because standard external profiles are not recommended for self-registration.

**Why B is wrong.** The Modify Users permission is a broad user administration permission. It isn't how user setup is delegated to external partners, and it doesn't limit a partner manager to the users of their own partner account.

**Why C is wrong.** Read/Write access to the User object is an object permission. It doesn't give partner managers a controlled way to create and manage the users of their own account, and it isn't the feature built for delegating user setup.`,
            sources:[
                {l:"Delegated External User Administration — Salesforce Help", u:"https://help.salesforce.com/HTViewHelpDoc?id=networks_DPUA.htm"},
                {l:"Create a Self-Registration Page — Trailhead", u:"https://trailhead.salesforce.com/identity_external/identity_external_registration"},
                {l:"Set Up the Community (self-registration and standard external profiles) — Trailhead", u:"https://trailhead.salesforce.com/es/content/learn/projects/create-a-partner-community/setup-the-community"}
            ]
        },
        {
            topic:"Access to Records",
            select:1,
            prompt:"Universal Containers (UC) has Affiliates who sell containers in countries where UC does not have a local office. UC has leveraged the Partner Community to manage the sales cycle. One of their affiliates has exponentially grown in the last years and restructured its internal sales team with the following structure: Sales VP –> Director of Sales –> Sales Manager –> Sales Reps. UC would like to have the ability to open up access to the sales opportunities according to the above structure. What is the main problem a Salesforce Architect will face to provide a solution?",
            options:[
                {k:"A", t:"Partner User Roles are limited to three levels."},
                {k:"B", t:"Partner Community does not support Role Hierarchy."},
                {k:"C", t:"Super User does not work in Partner Community."},
                {k:"D", t:"The Channel manager Role cannot be shared with Partner Community."}
            ],
            correct:["A"],
            explanation:
`**Why A is right.** The affiliate's structure has four levels (Sales VP, Director of Sales, Sales Manager, Sales Reps), and sharing opportunities up that structure would normally be done with a role hierarchy. A partner account can have at most three account roles (for example Executive, Manager and User). So four levels can't be represented, and that is the main problem the architect runs into. Options to work around it are to collapse the structure into three levels or to use other sharing tools, such as super user access or sharing rules, for the extra level.

**Why B is wrong.** Partner Community does support a role hierarchy. Partner users get roles per partner account, and managers above users in that hierarchy can see the records of the users below them. What is limited is the depth, not the existence of the feature.

**Why C is wrong.** Super user access does work in Partner Community. It is available for Partner Community and Customer Community Plus licenses, so it is one possible way to give specific people wider access.

**Why D is wrong.** The channel account manager role is not a barrier. An internal channel manager sits above the partner account roles in the org's role hierarchy and owns the partner accounts, and that is how the internal hierarchy gets access to the partner users' records.`,
            sources:[
                {l:"Set Up Account Roles and the Role Hierarchy — Trailhead", u:"https://trailhead.salesforce.com/content/learn/projects/communities_share_crm_data/account_roles_hierarchy"},
                {l:"Sharing within Salesforce communities (partner roles and super user access)", u:"https://ibooks.qq.com/read/1036698362/44"}
            ]
        },
        {
            topic:"Permissions to Standard Objects, Custom Objects, and Fields",
            select:1,
            prompt:"Universal Containers (UC) has a custom Apex class that enforces a business process and updates opportunities. UC has noticed that fields with field-level security permission of read only on certain users' profiles are being updates by this class. How should the architect fix this problem?",
            options:[
                {k:"A", t:"Use the WITH SECURITY_ENFORCED keyword in the SOQL statement."},
                {k:"B", t:"Put the code in an inner class that uses the With Sharing keyword."},
                {k:"C", t:"Use the ISUpdatetable() Apex method to test each field prior to allowing update."},
                {k:"D", t:"Add With Sharing keyword to the class."}
            ],
            correct:["C"],
            explanation:
`**Why C is right.** Apex generally runs in system context, so the current user's field-level security isn't applied to an update unless the code checks it. The isUpdateable() method on a field's describe result tells you whether the current user can update that field. Testing each field with it before the update means a field that is read-only for that user's profile isn't changed by the class. (The stripInaccessible method is another way to remove such fields before a DML operation.)

**Why A is wrong.** WITH SECURITY_ENFORCED is a clause for SOQL SELECT queries. It checks that the user can read the fields being queried. It does nothing about whether the user is allowed to update a field, which is the problem here.

**Why B is wrong.** The "with sharing" keyword enforces record-level sharing rules. It does not enforce object-level or field-level permissions, whether it is on an inner class or on the outer one.

**Why D is wrong.** For the same reason as B: "with sharing" controls which records the code can see, not which fields it can update.`,
            sources:[
                {l:"Enforce Security with Field and SObject Describe Methods — Apex Developer Guide", u:"https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_classes_field_object_describe.htm"},
                {l:"Enforcing Object and Field Permissions — Apex Reference Guide", u:"https://developer.salesforce.com/docs/atlas.en-us.246.0.apexcode.meta/apexref/apex_classes_perms_enforcing.htm"},
                {l:"Learn MOAR in Spring '20: Field-Level Security in Apex — Salesforce Developers Blog", u:"https://developer.salesforce.com/blogs/2020/01/learn-moar-in-spring-20-with-field-level-security-in-apex"}
            ]
        }
    ];

    const SELECT_WORD = {1:"Select one", 2:"Select two", 3:"Select three"};

    const STORAGE_KEY = "sharingVisibilityQuizState_v1";

    const arraysEqualAsSets = (a, b) => {
        if (a.length !== b.length) return false;
        const sa = [...a].sort();
        const sb = [...b].sort();
        return sa.every((v, i) => v === sb[i]);
    };

    // Fisher-Yates shuffle — never mutates the input array.
    const shuffleArray = (arr) => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };

    // A shuffled permutation of DATA's indices — the order tickets are displayed
    // in. Pass a subset of indices to shuffle just that subset (used to build a
    // single-section queue); omit it for the full deck.
    // Shuffle mode. On deals tickets in a random order; off keeps them in the
    // bank's own order (question 1, 2, 3, ...), so a ticket's position matches
    // its question number in the full deck. It always starts On when the page
    // loads and is deliberately NOT saved to localStorage.
    let shuffleOn = true;

    const buildOrder = (indices) => {
        const base = indices || DATA.map((_, i) => i);
        return shuffleOn ? shuffleArray(base) : [...base].sort((a, b) => a - b);
    };

    // Topics as they first appear in DATA — just the raw discovery order,
    // reordered below into the exam guide's own section order.
    const FIRST_SEEN_ORDER = DATA.reduce((acc, q) => (acc.includes(q.topic) ? acc : [...acc, q.topic]), []);

    // Exam blueprint for the Salesforce Certified Platform Sharing and Visibility
    // Architect exam, from Salesforce's published exam guide
    // (https://help.salesforce.com/s/articleView?id=005298977&type=1):
    // 4 content sections with these weights, 60 scored questions, 120 minutes,
    // 58% passing score. Every question's `topic` must be exactly one of these
    // 4 names so it counts toward the certification-weighted score.
    const EXAM_CATEGORY_WEIGHTS = {
        "Permissions to Standard Objects, Custom Objects, and Fields": 27,
        "Access to Records": 39,
        "Access to Other Data": 16,
        "Implications of Security Model Choice": 18
    };
    const EXAM_CATEGORY_MAP = Object.fromEntries(
        Object.keys(EXAM_CATEGORY_WEIGHTS).map((name) => [name, name])
    );
    const EXAM_PASSING_PCT = 58;

    // The exam guide's own top-to-bottom section order (the insertion order of
    // EXAM_CATEGORY_WEIGHTS above, which is written out in that exact order).
    // Every internal topic is re-sorted by the position of the official
    // category it maps to, so the section picker and both breakdowns below
    // read in the same order the published guide lists its sections in —
    // rather than whatever order questions happen to appear in the bank.
    // Ties (two internal topics folding into the same official category, e.g.
    // Change Management and Sandboxes and Environment Management, both under
    // "Environment Management and Deployment") keep their original first-seen
    // relative order, since Array#sort is stable. A topic with no mapping
    // (shouldn't happen, but a safety net) sorts to the end instead of the
    // front.
    const EXAM_BLUEPRINT_ORDER = Object.keys(EXAM_CATEGORY_WEIGHTS);
    const blueprintRank = (topicName) => {
        const idx = EXAM_BLUEPRINT_ORDER.indexOf(EXAM_CATEGORY_MAP[topicName]);
        return idx === -1 ? 9999 : idx;
    };
    // All official sections always appear in the picker (even before any question
    // is added to them); any topic outside the blueprint is appended after them.
    const SECTION_ORDER = [
        ...EXAM_BLUEPRINT_ORDER,
        ...FIRST_SEEN_ORDER.filter((t) => !EXAM_BLUEPRINT_ORDER.includes(t))
    ];

    // Ticket indices whose topic matches a given section name, in DATA order.
    const sectionIndices = (name) => DATA.reduce((acc, q, i) => (q.topic === name ? [...acc, i] : acc), []);

    const freshState = () => ({
        index:0,
        finished:false,
        section:"",
        order: buildOrder(),
        answers:DATA.map(() => ({selected:new Set(), checked:false, correct:null}))
    });

    const loadState = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return freshState();
            const saved = JSON.parse(raw);
            if (!saved || !Array.isArray(saved.answers)) {
                return freshState();
            }

            // The bank grows over time as tickets are added. Previously this meant
            // ANY change to DATA.length wiped a saved session outright — even a
            // pure addition — so adding one question reset every user back to
            // ticket 1 with no memory of where they actually were. As long as
            // tickets are only ever appended (never removed, reordered, or
            // replaced — the pattern this bank follows), every previously-saved
            // index still points at the exact same ticket it always did, so the
            // fix is to pad the saved answers out with fresh, unanswered entries
            // for the newly-added tickets instead of discarding the whole session.
            const savedCount = saved.answers.length;
            if (saved.answers.length < DATA.length) {
                const padding = Array.from({length: DATA.length - saved.answers.length}, () => ({selected:[], checked:false, correct:null}));
                saved.answers = [...saved.answers, ...padding];
            } else if (saved.answers.length > DATA.length) {
                // The bank shrank or was restructured — old indices can no longer be
                // trusted to mean the same ticket, so fall back to a clean slate
                // rather than risk showing the wrong ticket's saved history.
                return freshState();
            }

            const answers = saved.answers.map((a) => ({
                selected: new Set(Array.isArray(a.selected) ? a.selected : []),
                checked: !!a.checked,
                correct: a.correct === true ? true : (a.correct === false ? false : null)
            }));

            // A saved section must be "" (all sections) or one of the known domains.
            const section = typeof saved.section === "string" && (saved.section === "" || SECTION_ORDER.includes(saved.section))
                ? saved.section
                : "";

            // Nothing attempted yet — deal a freshly shuffled deck on every reload.
            // Once at least one ticket is checked, the deck order freezes so a
            // reload resumes the exact same shuffle instead of scrambling it again.
            const anyTraversed = answers.some((a) => a.checked);
            if (!anyTraversed) {
                return { index:0, finished:false, section, order: buildOrder(section ? sectionIndices(section) : undefined), answers };
            }

            // A saved order can be the full deck, a single-section queue, OR a
            // shorter "review mode" queue (just the previously-wrong tickets) —
            // accept any length from 1 up to DATA.length, as long as every entry is
            // a distinct valid index, so a reload during a section or review round
            // resumes that same reduced queue instead of discarding it back to the
            // full shuffled deck.
            const validOrder = Array.isArray(saved.order)
                && saved.order.length >= 1
                && saved.order.length <= DATA.length
                && new Set(saved.order).size === saved.order.length
                && saved.order.every((v) => Number.isInteger(v) && v >= 0 && v < DATA.length);

            let order = validOrder ? saved.order : buildOrder();
            let finished = !!saved.finished;

            // Tickets added since this session was saved: when the saved queue
            // covers its whole scope (all sections, or the active section), append
            // the new tickets to it so they show up on a plain reload, without
            // resetting. A partial queue (a review round of wrong tickets) is left
            // exactly as it was. If the round had already finished, it reopens on
            // the first new ticket.
            const scope = section ? sectionIndices(section) : DATA.map((_, i) => i);
            const oldScope = scope.filter((i) => i < savedCount);
            const newScope = scope.filter((i) => i >= savedCount);
            let firstNewPos = -1;
            if (validOrder && newScope.length && order.length === oldScope.length && oldScope.every((i) => order.includes(i))) {
                firstNewPos = order.length;
                order = [...order, ...newScope];
                finished = false;
            }

            let index = firstNewPos >= 0 && saved.finished
                ? firstNewPos
                : Math.max(0, Math.min(order.length - 1, Number(saved.index) || 0));

            // Shuffle always starts On, so a queue that was saved while it was Off
            // (still in ascending question order) is reshuffled on load. The
            // ticket that was on screen stays on screen at its new position.
            const savedInBankOrder = order.length > 1 && order.every((v, k) => k === 0 || order[k - 1] < v);
            if (savedInBankOrder) {
                const currentQi = order[index];
                order = buildOrder(order);
                index = Math.max(0, order.indexOf(currentQi));
            }

            return {
                index,
                finished,
                section,
                order,
                answers
            };
        } catch (e) {
            return freshState();
        }
    };

    const state = loadState();

    // Transient "select N answers" nudge — shown when the Next/Check button is
    // clicked with some but not enough options picked. Deliberately kept out
    // of `state`/localStorage: it's a momentary UI toast, not something that
    // should survive a reload or reappear on its own. `qi` scopes it to the
    // exact ticket it was raised for, so it can never bleed onto a different
    // one after navigating away and back.
    let underSelectNotice = null;
    let underSelectNoticeTimer = null;
    const clearUnderSelectNotice = () => {
        if (underSelectNoticeTimer) { clearTimeout(underSelectNoticeTimer); underSelectNoticeTimer = null; }
        underSelectNotice = null;
    };
    const showUnderSelectNotice = (qi, need, have) => {
        clearUnderSelectNotice();
        underSelectNotice = { qi, need, have };
        underSelectNoticeTimer = setTimeout(() => {
            underSelectNoticeTimer = null;
            underSelectNotice = null;
            renderTicket();
        }, 3500);
        renderTicket();
    };

    const saveState = () => {
        try {
            const serializable = {
                index: state.index,
                finished: state.finished,
                section: state.section,
                order: state.order,
                answers: state.answers.map((a) => ({
                    selected: [...a.selected],
                    checked: a.checked,
                    correct: a.correct
                }))
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
        } catch (e) {
            // Storage unavailable (private browsing, quota, etc.) — fail silently, quiz still works in-memory.
        }
    };

    // Deals a brand-new shuffled ticket order, back to the first position. Used
    // whenever the deck should reshuffle (finishing the whole set, or an
    // explicit full reset).
    const reshuffleDeck = () => {
        state.order = buildOrder();
        state.index = 0;
    };

    const els = {
        stats: document.getElementById("stats"),
        queue: document.getElementById("queue"),
        ticket: document.getElementById("ticket"),
        shift: document.getElementById("shift"),
        sectionSelect: document.getElementById("sectionSelect")
    };

    // Fills the "Practice section" dropdown once (the domain list and their
    // ticket counts are static) and reflects whatever section is active.
    const populateSectionPicker = () => {
        if (!els.sectionSelect) return;
        const allOption = `<option value="">All sections (${DATA.length})</option>`;
        const sectionOptions = SECTION_ORDER.map((name) => {
            const count = sectionIndices(name).length;
            return `<option value="${esc(name)}"${count ? "" : " disabled"}>${esc(name)} (${count})</option>`;
        }).join("");
        els.sectionSelect.innerHTML = allOption + sectionOptions;
        els.sectionSelect.value = state.section || "";
    };

    // Switches the active queue to a single section (or back to "All sections"
    // when name is ""). Existing answers are kept as-is — jumping between
    // sections never erases progress — only the order/position/finished flag
    // change, exactly like starting a review round.
    const selectSection = (name) => {
        clearUnderSelectNotice();
        const valid = name === "" || SECTION_ORDER.includes(name);
        state.section = valid ? name : "";
        state.order = buildOrder(state.section ? sectionIndices(state.section) : undefined);
        state.index = 0;
        state.finished = false;
        if (els.sectionSelect) els.sectionSelect.value = state.section;
        saveState();
        renderAll();
        document.getElementById("ticket")?.scrollIntoView({behavior:"smooth", block:"start"});
    };

    // Flips shuffle mode and rebuilds the current queue (the full deck, a
    // single section, or a review round) in the new order. Answers are kept,
    // and the ticket currently on screen stays on screen at its new position.
    const renderShuffleToggle = () => {
        const input = document.getElementById("shuffleToggle");
        const stateText = document.getElementById("shuffleToggleState");
        if (input) input.checked = shuffleOn;
        if (stateText) stateText.textContent = shuffleOn ? "On" : "Off";
    };

    const toggleShuffle = (on) => {
        clearUnderSelectNotice();
        shuffleOn = !!on;
        const currentQi = state.order[state.index];
        state.order = buildOrder(state.order);
        const newPos = state.order.indexOf(currentQi);
        state.index = newPos === -1 ? 0 : newPos;
        saveState();
        renderShuffleToggle();
        renderAll();
    };

    const esc = (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    const escAttr = (s) => esc(s).replace(/"/g,"&quot;");

    const mdToHtml = (md) => md.split(/\n\n+/).map((p) => {
        const withBold = esc(p).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        return `<p>${withBold}</p>`;
    }).join("");

    const toggleSelect = (qi, key) => {
        const a = state.answers[qi];
        if (a.checked) return;
        clearUnderSelectNotice();
        const q = DATA[qi];
        if (q.select === 1) {
            a.selected = new Set([key]);
        } else if (a.selected.has(key)) {
            a.selected.delete(key);
        } else {
            a.selected.add(key);
        }
        saveState();
        renderTicket();
    };

    const checkAnswer = (qi) => {
        const a = state.answers[qi];
        const q = DATA[qi];
        if (a.selected.size !== q.select) return;
        clearUnderSelectNotice();
        a.checked = true;
        a.correct = arraysEqualAsSets([...a.selected], q.correct);
        saveState();
        renderAll();
    };

    const goTo = (i) => {
        clearUnderSelectNotice();
        state.index = Math.max(0, Math.min(state.order.length - 1, i));
        state.finished = false;
        saveState();
        renderAll();
        document.getElementById("ticket")?.scrollIntoView({behavior:"smooth", block:"start"});
    };

    const finishQuiz = () => {
        clearUnderSelectNotice();
        state.finished = true;
        state.index = 0;
        saveState();
        renderAll();
        document.getElementById("shift")?.scrollIntoView({behavior:"smooth", block:"start"});
    };

    // Re-queues only the tickets that were answered incorrectly, clears their
    // prior selection so they can be attempted fresh, and drops back into the
    // ticket view starting at the first one. Correctly-answered tickets are
    // left untouched — once every missed ticket is checked again, "End of
    // shift" naturally reappears (it triggers off the queue that was just
    // finished — the full deck, a section, or a previous review round — not
    // always the full DATA set) with the updated score.
    const reviewErrors = (wrongOriginalIdx) => {
        if (!wrongOriginalIdx || !wrongOriginalIdx.length) return;
        clearUnderSelectNotice();
        wrongOriginalIdx.forEach((qi) => {
            state.answers[qi] = {selected:new Set(), checked:false, correct:null};
        });
        state.order = wrongOriginalIdx;
        state.index = 0;
        state.finished = false;
        saveState();
        renderAll();
        document.getElementById("ticket")?.scrollIntoView({behavior:"smooth", block:"start"});
    };

    const renderStats = () => {
        const total = DATA.length;
        let resolved = 0, correct = 0;
        for (const a of state.answers) {
            if (a.checked) {
                resolved++;
                if (a.correct) correct++;
            }
        }
        const acc = resolved ? `${Math.round((correct / resolved) * 100)}%` : "—";
        els.stats.innerHTML = `
            <div class="stat"><span class="num mono">${resolved} / ${total}</span><span class="lbl">Resolved</span></div>
            <div class="stat"><span class="num mono">${correct}</span><span class="lbl">Correct</span></div>
            <div class="stat"><span class="num mono">${acc}</span><span class="lbl">Accuracy</span></div>`;
    };

    const renderQueue = () => {
        els.queue.innerHTML = state.order.map((qi, pos) => {
            const a = state.answers[qi];
            const classes = ["chip"];
            if (pos === state.index) classes.push("current");
            if (a.checked) classes.push(a.correct ? "correct" : "wrong");
            return `<button class="${classes.join(" ")}" data-i="${pos}" aria-label="Ticket ${pos + 1}">${pos + 1}</button>`;
        }).join("");
        els.queue.querySelectorAll(".chip").forEach((btn) => {
            btn.addEventListener("click", () => goTo(parseInt(btn.dataset.i, 10)));
        });
        // The strip scrolls horizontally (see .queue in styles.css) and can hold
        // a few hundred chips, so the current ticket's chip can easily sit off-screen
        // to either side. Keep it in view — centered when possible — every time
        // the queue re-renders, so the visible range always follows the user's
        // actual position instead of staying wherever it was last scrolled to.
        const currentChip = els.queue.querySelector(".chip.current");
        if (currentChip) {
            currentChip.scrollIntoView({behavior:"smooth", block:"nearest", inline:"center"});
        }
    };

    const renderTicket = () => {
        if (!DATA.length || !state.order.length) {
            els.ticket.innerHTML = `
                <div class="perf"></div>
                <div class="ticket-head"><div><span class="ticket-id mono">NO TICKETS YET</span></div></div>
                <p class="prompt">The question bank is empty. Add questions to the <code>DATA</code> array at the top of <code>script.js</code>.</p>`;
            return;
        }
        const i = state.index;
        const qi = state.order[i];
        const q = DATA[qi];
        const a = state.answers[qi];
        const isLastTicket = i === state.order.length - 1;

        const badgeHtml = !a.checked
            ? `<span class="badge open">Open</span>`
            : a.correct
                ? `<span class="badge good">Resolved — Correct</span>`
                : `<span class="badge bad">Resolved — Review</span>`;

        const optionsHtml = q.options.map((opt) => {
            const picked = a.selected.has(opt.k);
            const classes = ["opt"];
            let flag = "";
            if (picked && !a.checked) classes.push("picked");
            if (a.checked) {
                const isCorrectOpt = q.correct.includes(opt.k);
                if (picked && isCorrectOpt) { classes.push("reveal-correct"); flag = `<span class="opt-flag">✓ correct</span>`; }
                else if (picked && !isCorrectOpt) { classes.push("reveal-wrong"); flag = `<span class="opt-flag">✕ incorrect</span>`; }
                else if (!picked && isCorrectOpt) { classes.push("reveal-missed"); flag = `<span class="opt-flag">✓ should be selected</span>`; }
            }
            const markClasses = ["mark", "mono", ...(q.select === 1 ? ["circle"] : [])].join(" ");
            const markContent = a.checked
                ? (q.correct.includes(opt.k) ? "✓" : (picked ? "✕" : opt.k))
                : opt.k;
            return `<button type="button" class="${classes.join(" ")}" data-k="${opt.k}" ${a.checked ? "disabled" : ""}><span class="${markClasses}">${markContent}</span><span class="opt-text">${esc(opt.t)}</span>${flag}</button>`;
        }).join("");

        const resultBanner = !a.checked
            ? ""
            : a.correct
                ? `<div class="result-banner good">Correct — matches Salesforce documentation.</div>`
                : `<div class="result-banner bad">Not quite — read the resolution notes below.</div>`;

        const resolutionHtml = !a.checked ? "" : (() => {
            const refsHtml = q.sources.map((s) => `<a class="ref" href="${s.u}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3h7v7"/><path d="M10 14L21 3"/><path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6"/></svg>${esc(s.l)}</a>`).join("");
            return `<div class="resolution"><h3>Resolution notes</h3>${mdToHtml(q.explanation)}<div class="refs"><span class="ref-label">Attached knowledge articles</span>${refsHtml}</div></div>`;
        })();

        // The ticketnav's single trailing button now covers three jobs at once,
        // depending on where this ticket stands, instead of a separate "Check
        // answer" / "Try again" pair above the options:
        //  - nothing picked yet: "Skip question" — just advances, exactly like
        //    the plain Next action always has.
        //  - a selection is in progress (or complete) but not checked yet:
        //    "Check answer" — evaluates it, staying disabled until exactly
        //    q.select options are picked (same gate the old Check button used).
        //  - already checked, right or wrong: "Next"/"Finish" — always just
        //    advances. There's no retry loop anymore; a wrong answer moves on
        //    the same as a right one, after the resolution notes are read.
        const hasSelection = a.selected.size > 0;
        const hasFullSelection = a.selected.size === q.select;
        let nextMode, nextLabel;
        if (!a.checked && !hasSelection) {
            nextMode = "skip";
            nextLabel = "Skip question";
        } else if (!a.checked) {
            // Left enabled even when under-selected — clicking without enough
            // options picked doesn't silently do nothing, it raises the toast
            // below telling the user exactly how many more to pick.
            nextMode = "check";
            nextLabel = "Check answer";
        } else {
            nextMode = "advance";
            nextLabel = isLastTicket ? "Finish" : "Next ›";
        }
        const countHintHtml = !a.checked
            ? `<span class="count-hint mono">${a.selected.size} of ${q.select} selected</span>`
            : "";
        const underSelectHtml = (underSelectNotice && underSelectNotice.qi === qi)
            ? `<div class="select-warning" role="status"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>${SELECT_WORD[q.select]} (${q.select}) — you've picked ${underSelectNotice.have}. Select ${q.select - underSelectNotice.have} more to check this ticket.</span></div>`
            : "";

        els.ticket.innerHTML = `
            <div class="perf"></div>
            <div class="ticket-head">
                <div>
                    <span class="ticket-id mono">TICKET #${String(i + 1).padStart(2, "0")} OF ${state.order.length}</span><br>
                    <span class="ticket-topic">${esc(q.topic)}</span>
                </div>
                ${badgeHtml}
            </div>
            <p class="prompt">${esc(q.prompt)}</p>
            <span class="select-hint">${SELECT_WORD[q.select]}${q.select > 1 ? ` (${q.select})` : ""}</span>
            ${q.note ? `<span class="q-note" tabindex="0" aria-label="${escAttr(q.note)}" data-tip="${escAttr(q.note)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>Note</span>` : ""}
            ${resultBanner}
            <div class="options">${optionsHtml}</div>
            ${countHintHtml}
            ${underSelectHtml}
            <div class="ticketnav">
                <button class="btn ghost" id="prevBtn" ${i === 0 ? "disabled" : ""}>‹ Previous</button>
                <span class="pos mono">${i + 1} / ${state.order.length}</span>
                <button class="btn-bs btn-bs-primary" id="nextBtn">${nextLabel}</button>
            </div>
            ${resolutionHtml}`;

        els.ticket.querySelectorAll(".opt").forEach((btn) => {
            btn.addEventListener("click", () => toggleSelect(qi, btn.dataset.k));
        });
        document.getElementById("prevBtn").addEventListener("click", () => goTo(i - 1));
        document.getElementById("nextBtn").addEventListener("click", () => {
            if (nextMode === "check") {
                if (!hasFullSelection) { showUnderSelectNotice(qi, q.select, a.selected.size); return; }
                checkAnswer(qi);
                return;
            }
            if (isLastTicket) { finishQuiz(); } else { goTo(i + 1); }
        });
    };

    const renderShift = () => {
        // Scoped to the CURRENT queue (state.order) rather than the full DATA
        // set, so this works the same whether that queue is the full deck, a
        // single section, or a review-errors round.
        const total = state.order.length;
        if (!total) { els.shift.innerHTML = ""; return; }
        const resolved = state.order.filter((qi) => state.answers[qi].checked).length;
        // Show the summary once every ticket has been individually checked, OR
        // once the user has explicitly hit Finish — which can happen with some
        // tickets still skipped/unanswered. Either way, any ticket that was
        // never checked counts as incorrect below rather than blocking the
        // summary from appearing at all.
        if (resolved < total && !state.finished) { els.shift.innerHTML = ""; return; }

        const isCorrect = (qi) => state.answers[qi].checked && state.answers[qi].correct;
        const correct = state.order.filter(isCorrect).length;
        const wrongOriginalIdx = state.order.filter((qi) => !isCorrect(qi));
        const skippedCount = total - resolved;
        const pct = total ? Math.round((correct / total) * 100) : 0;
        const scopeLabel = state.section ? esc(state.section) : "all sections";

        // Score broken down by exam domain (topic), for whatever categories are
        // actually present in the current queue — the full deck touches every
        // topic seen so far, a section touches just 1, a review round touches
        // whichever categories its wrong tickets came from. Skipped entirely
        // when there's only one category present, since it would just repeat
        // the overall score line.
        const byCategory = {};
        state.order.forEach((qi) => {
            const topic = DATA[qi].topic;
            const bucket = byCategory[topic] || (byCategory[topic] = { correct: 0, total: 0 });
            bucket.total++;
            if (isCorrect(qi)) bucket.correct++;
        });
        const categoryNames = Object.keys(byCategory);
        const orderedCategoryNames = SECTION_ORDER.filter((name) => byCategory[name])
            .concat(categoryNames.filter((name) => !SECTION_ORDER.includes(name))); // safety net, shouldn't happen
        const categoryBreakdownHtml = orderedCategoryNames.length > 1
            ? `<div class="category-breakdown">
                    <span class="ref-label" style="display:block;">By category</span>
                    ${orderedCategoryNames.map((name) => {
                        const b = byCategory[name];
                        const catPct = Math.round((b.correct / b.total) * 100);
                        const barColor = catPct >= 80 ? "var(--good)" : catPct < 50 ? "var(--bad)" : "var(--accent)";
                        return `<div class="cat-row">
                                <span class="cat-name">${esc(name)}</span>
                                <div class="cat-bar"><div class="cat-bar-fill" style="width:${catPct}%; background:${barColor};"></div></div>
                                <span class="cat-score mono">${b.correct}/${b.total} · ${catPct}%</span>
                            </div>`;
                    }).join("")}
                </div>`
            : "";

        // Certification-style weighted score: fold this round's per-topic results
        // into Salesforce's official category blueprint, weight each category's
        // accuracy by that category's real exam weight, then renormalize across
        // only the categories this round actually touched. Only worth showing
        // once more than one official category is in play, for the same reason
        // the plain by-topic breakdown above is gated the same way.
        const byOfficialCat = {};
        orderedCategoryNames.forEach((name) => {
            const officialCat = EXAM_CATEGORY_MAP[name];
            if (!officialCat) return;
            const b = byCategory[name];
            const bucket = byOfficialCat[officialCat] || (byOfficialCat[officialCat] = { correct: 0, total: 0 });
            bucket.correct += b.correct;
            bucket.total += b.total;
        });
        const coveredOfficialCats = Object.keys(byOfficialCat)
            .sort((a, b) => EXAM_BLUEPRINT_ORDER.indexOf(a) - EXAM_BLUEPRINT_ORDER.indexOf(b));
        const coveredWeight = coveredOfficialCats.reduce((sum, c) => sum + EXAM_CATEGORY_WEIGHTS[c], 0);
        const missingOfficialCats = Object.keys(EXAM_CATEGORY_WEIGHTS).filter((c) => !byOfficialCat[c]);

        const weightedBreakdownHtml = coveredOfficialCats.length > 1
            ? (() => {
                    const weightedSum = coveredOfficialCats.reduce((sum, c) => {
                        const b = byOfficialCat[c];
                        return sum + (b.correct / b.total) * EXAM_CATEGORY_WEIGHTS[c];
                    }, 0);
                    const weightedPct = coveredWeight ? Math.round((weightedSum / coveredWeight) * 100) : 0;
                    const passed = weightedPct >= EXAM_PASSING_PCT;
                    const rowsHtml = coveredOfficialCats.map((c) => {
                        const b = byOfficialCat[c];
                        const catPct = Math.round((b.correct / b.total) * 100);
                        const barColor = catPct >= 80 ? "var(--good)" : catPct < 50 ? "var(--bad)" : "var(--accent)";
                        return `<div class="cat-row">
                                <span class="cat-name">${esc(c)} <span class="cat-weight mono">${EXAM_CATEGORY_WEIGHTS[c]}%</span></span>
                                <div class="cat-bar"><div class="cat-bar-fill" style="width:${catPct}%; background:${barColor};"></div></div>
                                <span class="cat-score mono">${b.correct}/${b.total} · ${catPct}%</span>
                            </div>`;
                    }).join("");
                    const coverageNote = missingOfficialCats.length
                        ? `Renormalized across the ${coveredOfficialCats.length} of ${EXAM_BLUEPRINT_ORDER.length} official categories this bank covers so far (weights re-summed to 100%). Not yet covered: ${missingOfficialCats.map((c) => `${esc(c)} (${EXAM_CATEGORY_WEIGHTS[c]}%)`).join(", ")}.`
                        : `All ${EXAM_BLUEPRINT_ORDER.length} official categories covered — weights used exactly as published.`;
                    return `<div class="exam-weighted">
                            <span class="ref-label" style="display:block;">Certification-weighted score · exam blueprint</span>
                            ${rowsHtml}
                            <div class="exam-weighted-total">
                                <span>Weighted score (${coveredWeight}% of exam weight covered)</span>
                                <span class="exam-weighted-pct ${passed ? "pass" : "fail"} mono">${weightedPct}%</span>
                            </div>
                            <p class="exam-weighted-note">${coverageNote} Salesforce's real passing bar for this exam is ${EXAM_PASSING_PCT}% — this is an estimate of how that same math would score this round, not an official result.</p>
                        </div>`;
                })()
            : "";

        const reviewHtml = wrongOriginalIdx.length
            ? `<div class="review-chips">${wrongOriginalIdx.map((qi) => {
                    const pos = state.order.indexOf(qi);
                    const skipped = !state.answers[qi].checked;
                    return `<button class="chip mono" data-i="${pos}" style="width:auto;padding:0 10px;">Ticket ${pos + 1}${skipped ? " (skipped)" : ""}</button>`;
                }).join("")}</div>`
            : `<p style="margin:0;">Every ticket resolved correctly.</p>`;

        const reviewErrorsBtnHtml = wrongOriginalIdx.length
            ? `<button class="btn" id="reviewErrorsBtn" style="margin-top:14px;">Review errors (${wrongOriginalIdx.length})</button>`
            : "";

        els.shift.innerHTML = `
            <div class="shift">
                <h2>End of shift</h2>
                <p>${resolved === total ? `All ${total} tickets resolved` : `${resolved} of ${total} tickets answered — ${skippedCount} skipped ticket${skippedCount === 1 ? "" : "s"} counted as incorrect`} — ${scopeLabel}.</p>
                <div class="score-line">Score: ${correct}/${total} - ${pct}%</div>
                <div class="row">
                    <div><div class="num">${correct} / ${total}</div><div class="lbl">Correct</div></div>
                    <div><div class="num">${pct}%</div><div class="lbl">Accuracy</div></div>
                </div>
                ${categoryBreakdownHtml}
                ${weightedBreakdownHtml}
                ${wrongOriginalIdx.length ? `<span class="ref-label" style="margin-bottom:8px;display:block;margin-top:${(categoryBreakdownHtml || weightedBreakdownHtml) ? "16px" : "0"};">Tickets to review</span>` : ""}
                ${reviewHtml}
                ${reviewErrorsBtnHtml}
            </div>`;

        els.shift.querySelectorAll(".chip").forEach((btn) => {
            btn.addEventListener("click", () => goTo(parseInt(btn.dataset.i, 10)));
        });
        document.getElementById("reviewErrorsBtn")?.addEventListener("click", () => reviewErrors(wrongOriginalIdx));
    };

    const renderAll = () => {
        renderStats();
        renderQueue();
        renderTicket();
        renderShift();
        document.getElementById("ticketCount").textContent = `${DATA.length} ticket${DATA.length === 1 ? "" : "s"}`;

        els.stats.style.display = state.finished ? "none" : "";
        els.queue.style.display = state.finished ? "none" : "";
        els.ticket.style.display = state.finished ? "none" : "";
    };

    populateSectionPicker();
    els.sectionSelect?.addEventListener("change", (e) => selectSection(e.target.value));
    renderShuffleToggle();
    document.getElementById("shuffleToggle")?.addEventListener("change", (e) => toggleShuffle(e.target.checked));

    document.getElementById("resetAll").addEventListener("click", () => {
        clearUnderSelectNotice();
        state.finished = false;
        state.section = "";
        state.answers = DATA.map(() => ({selected:new Set(), checked:false, correct:null}));
        reshuffleDeck();
        saveState();
        if (els.sectionSelect) els.sectionSelect.value = "";
        renderAll();
    });

    // ---------- Export (Word doc / PDF) — original DATA order, questions +
    // suggested answers + correct answers only, no explanations or sources.

    const buildExportRowsHtml = () => DATA.map((q, idx) => {
        const optionsHtml = q.options.map((o) => `<div class="pq-opt">${esc(o.k)}. ${esc(o.t)}</div>`).join("");
        const correctLabel = q.correct.length > 1 ? "Correct answers" : "Correct answer";
        return `
            <div class="pq">
                <p class="pq-num">Question ${idx + 1}</p>
                <p class="pq-topic">${esc(q.topic)}</p>
                <p class="pq-prompt">${esc(q.prompt)}</p>
                <div class="pq-options">${optionsHtml}</div>
                <p class="pq-correct">${correctLabel}: ${esc(q.correct.join(", "))}</p>
            </div>`;
    }).join("");

    const buildExportBodyHtml = () => `
        <h1>Sharing and Visibility Architect</h1>
        <p class="print-meta">Practice questions — ${DATA.length} total.</p>
        ${buildExportRowsHtml()}`;

    const exportWord = () => {
        const doc = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Sharing and Visibility Architect — Practice Questions</title>
<style>
    body{ font-family: Calibri, Arial, sans-serif; font-size:12pt; color:#111; }
    h1{ font-size:18pt; margin:0 0 4px; }
    .print-meta{ font-size:10pt; color:#555; margin:0 0 24px; }
    .pq{ margin:0 0 20px; }
    .pq-num{ font-weight:700; margin:0 0 2px; }
    .pq-topic{ font-size:9pt; text-transform:uppercase; letter-spacing:0.05em; color:#666; margin:0 0 6px; }
    .pq-prompt{ font-weight:600; margin:0 0 8px; }
    .pq-options{ margin:0 0 8px 18px; }
    .pq-opt{ margin:2px 0; }
    .pq-correct{ margin:0; font-weight:700; }
</style></head>
<body>${buildExportBodyHtml()}</body></html>`;
        const blob = new Blob(["﻿", doc], { type: "application/msword" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Sharing-and-Visibility-Architect-Practice-Questions.doc";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    const exportPdf = () => {
        const printArea = document.getElementById("printExport");
        printArea.innerHTML = buildExportBodyHtml();
        document.body.classList.add("printing-export");
        const cleanup = () => {
            document.body.classList.remove("printing-export");
            window.removeEventListener("afterprint", cleanup);
        };
        window.addEventListener("afterprint", cleanup);
        window.print();
    };

    const exportMenu = document.getElementById("exportMenu");
    const exportBtn = document.getElementById("exportBtn");
    const exportMenuList = document.getElementById("exportMenuList");

    const closeExportMenu = () => {
        if (!exportMenuList) return;
        exportMenuList.hidden = true;
        exportBtn?.setAttribute("aria-expanded", "false");
    };
    const openExportMenu = () => {
        if (!exportMenuList) return;
        exportMenuList.hidden = false;
        exportBtn?.setAttribute("aria-expanded", "true");
    };

    exportBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (exportMenuList?.hidden) openExportMenu();
        else closeExportMenu();
    });
    document.getElementById("exportPdfBtn")?.addEventListener("click", () => {
        closeExportMenu();
        exportPdf();
    });
    document.getElementById("exportWordBtn")?.addEventListener("click", () => {
        closeExportMenu();
        exportWord();
    });
    document.addEventListener("click", (e) => {
        if (exportMenu && !exportMenu.contains(e.target)) closeExportMenu();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeExportMenu();
    });

    renderAll();
})();
