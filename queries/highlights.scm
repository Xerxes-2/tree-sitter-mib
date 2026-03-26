; Keywords
[
  "DEFINITIONS"
  "BEGIN"
  "END"
  "IMPORTS"
  "FROM"
  "OBJECT"
  "IDENTIFIER"
  "OBJECT-TYPE"
  "MODULE-IDENTITY"
  "NOTIFICATION-TYPE"
  "TRAP-TYPE"
  "OBJECT-GROUP"
  "MODULE-COMPLIANCE"
  "NOTIFICATION-GROUP"
  "TEXTUAL-CONVENTION"
  "AGENT-CAPABILITIES"
  "SEQUENCE"
  "OF"
  "SYNTAX"
  "MAX-ACCESS"
  "ACCESS"
  "STATUS"
  "DESCRIPTION"
  "REFERENCE"
  "INDEX"
  "AUGMENTS"
  "DEFVAL"
  "UNITS"
  "DISPLAY-HINT"
  "LAST-UPDATED"
  "ORGANIZATION"
  "CONTACT-INFO"
  "REVISION"
  "OBJECTS"
  "ENTERPRISE"
  "VARIABLES"
  "MODULE"
  "MANDATORY-GROUPS"
  "GROUP"
  "NOTIFICATIONS"
  "PRODUCT-RELEASE"
  "SUPPORTS"
  "INCLUDES"
  "VARIATION"
  "WRITE-SYNTAX"
  "CREATION-REQUIRES"
  "MIN-ACCESS"
  "IMPLIED"
  "SIZE"
] @keyword

; Built-in types
[
  "INTEGER"
  "Integer32"
  "Unsigned32"
  "Counter32"
  "Counter64"
  "Gauge32"
  "TimeTicks"
  "IpAddress"
  "Opaque"
  "Counter"
  "OCTET"
  "STRING"
  "BITS"
] @type.builtin

; Access values
(access_value) @constant

; Status values
(status_value) @constant

; Module definition name
(module_definition
  name: (module_name
    (identifier) @module))

; Object identifier assignments
(object_identifier_assignment
  name: (identifier) @variable)

; Object type definitions
(object_type_definition
  name: (identifier) @variable)

; Module identity
(module_identity_definition
  name: (identifier) @variable)

; Notification type
(notification_type_definition
  name: (identifier) @variable)

; Trap type
(trap_type_definition
  name: (identifier) @variable)

; Object group
(object_group_definition
  name: (identifier) @variable)

; Module compliance
(module_compliance_definition
  name: (identifier) @variable)

; Notification group
(notification_group_definition
  name: (identifier) @variable)

; Textual convention
(textual_convention_definition
  name: (identifier) @type)

; Agent capabilities
(agent_capabilities_definition
  name: (identifier) @variable)

; Sequence definition
(sequence_definition
  name: (identifier) @type)

; Sequence field names
(sequence_field
  name: (identifier) @property)

; Enum values
(enum_value
  (identifier) @constant)

; Import module names
(import_from
  module: (identifier) @module)

; Strings
(quoted_string) @string

; Numbers
(number) @number

; OID assignment operator
"::=" @operator

; Comments
(comment) @comment
