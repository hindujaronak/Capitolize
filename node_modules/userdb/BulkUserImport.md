# Bulk User Import

Users can be bulk imported using either .csv or .xlsx format spreadsheets.
The bulk import function is invoked from a button on the users table.

This document describes the format the input spreadsheet is expected to have
and how import works if a super-admin does it verses an admin.

## Common Form

The common spreadsheet format is:

    First Name, Last Name, Email, Role, Password

The `Role` and `Password` fields may be blank, or may have values.  If `Password` has a value, its is
that user's initial password in clear ascii; it will be hashed when written to the database.

This format of the spreadsheet works for logged in users with the "admin" role, since they can only
import users into their own account.

For a user with "super-admin", this form works well when importing users into a particular account; ie.
clicking on "users..." in an account row, and importing users from the screen that appears.

## Super-admin Form

A format that can be used by a super-admin adds an account field to the end of each line:

    First Name, Last Name, Email, Role, Password, Account Name

If the super-admin is on the "Users all" screen and imports users, and the spreadsheet has the additional
account name column, the super-admin can import into multiple accounts.

If the super-admin is on a particular account users screen, then the account name column is **ignored**.

Even if the super-admin form of the spreadsheet is used by an admin, the account column, if present, is
ignored.

## The Example Spreadsheet

The import users modal contains a link to an example spreadsheet.  This is expected to be fetched (GET) from

    /import-users-example.csv

so you should arrange to make that file available at that endpoint.  The file can look like this:

    First Name,Last Name,Email,Role,Password
    John,Smith,john.smith@example.com,admin,InitialPassword3!2!1!
