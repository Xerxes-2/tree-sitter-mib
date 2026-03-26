/// <reference types="tree-sitter-cli/dsl" />

module.exports = grammar({
  name: "mib",

  extras: ($) => [/\s/, $.comment],

  conflicts: ($) => [
    [$.compliance_object_clause],
    [$.named_oid_component, $.bit_list],
    [$.variation_clause],
  ],

  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat($.module_definition),

    module_definition: ($) =>
      seq(
        field("name", $.module_name),
        "DEFINITIONS",
        "::=",
        "BEGIN",
        optional($.imports),
        repeat($._definition),
        "END",
      ),

    module_name: ($) => $.identifier,

    // IMPORTS section
    imports: ($) => seq("IMPORTS", repeat1($.import_from), ";"),

    import_from: ($) =>
      seq($.import_list, "FROM", field("module", $.identifier)),

    import_list: ($) => seq($._import_identifier, repeat(seq(",", $._import_identifier))),

    _import_identifier: ($) => $.identifier,

    // Top-level definitions
    _definition: ($) =>
      choice(
        $.object_identifier_assignment,
        $.object_type_definition,
        $.module_identity_definition,
        $.notification_type_definition,
        $.trap_type_definition,
        $.object_group_definition,
        $.module_compliance_definition,
        $.notification_group_definition,
        $.textual_convention_definition,
        $.agent_capabilities_definition,
        $.sequence_definition,
      ),

    // name OBJECT IDENTIFIER ::= { parent sub }
    object_identifier_assignment: ($) =>
      seq(
        field("name", $.identifier),
        "OBJECT",
        "IDENTIFIER",
        "::=",
        $.object_identifier_value,
      ),

    object_identifier_value: ($) =>
      seq("{", repeat1($._oid_component), "}"),

    _oid_component: ($) =>
      choice($.named_oid_component, $.number),

    named_oid_component: ($) =>
      choice(
        seq($.identifier, "(", $.number, ")"),
        $.identifier,
      ),

    // OBJECT-TYPE macro
    object_type_definition: ($) =>
      seq(
        field("name", $.identifier),
        "OBJECT-TYPE",
        repeat($._object_type_clause),
        "::=",
        $.object_identifier_value,
      ),

    _object_type_clause: ($) =>
      choice(
        $.syntax_clause,
        $.access_clause,
        $.status_clause,
        $.description_clause,
        $.reference_clause,
        $.index_clause,
        $.augments_clause,
        $.defval_clause,
        $.units_clause,
        $.display_hint_clause,
      ),

    syntax_clause: ($) =>
      seq("SYNTAX", $.syntax_type),

    access_clause: ($) =>
      seq(
        choice("MAX-ACCESS", "ACCESS"),
        $.access_value,
      ),

    access_value: ($) =>
      choice(
        "read-only",
        "read-write",
        "read-create",
        "write-only",
        "not-accessible",
        "accessible-for-notify",
        "not-implemented",
      ),

    status_clause: ($) =>
      seq("STATUS", $.status_value),

    status_value: ($) =>
      choice("current", "deprecated", "obsolete", "mandatory", "optional"),

    description_clause: ($) =>
      seq("DESCRIPTION", $.quoted_string),

    reference_clause: ($) =>
      seq("REFERENCE", $.quoted_string),

    index_clause: ($) =>
      seq(
        "INDEX",
        "{",
        $.index_value,
        repeat(seq(",", $.index_value)),
        "}",
      ),

    index_value: ($) =>
      seq(optional("IMPLIED"), $.identifier),

    augments_clause: ($) =>
      seq("AUGMENTS", "{", $.identifier, "}"),

    defval_clause: ($) =>
      seq(
        "DEFVAL",
        "{",
        $._defval_value,
        "}",
      ),

    _defval_value: ($) =>
      choice(
        $.identifier,
        $.number,
        $.quoted_string,
        $.object_identifier_value,
        $.bit_list,
      ),

    bit_list: ($) =>
      seq("{", optional(seq($.identifier, repeat(seq(",", $.identifier)))), "}"),

    units_clause: ($) =>
      seq("UNITS", $.quoted_string),

    display_hint_clause: ($) =>
      seq("DISPLAY-HINT", $.quoted_string),

    // Syntax types
    syntax_type: ($) =>
      choice(
        $.integer_type,
        $.string_type,
        $.bits_type,
        $.sequence_of_type,
        $.named_type,
      ),

    integer_type: ($) =>
      seq(
        choice("INTEGER", "Integer32", "Unsigned32", "Counter32",
          "Counter64", "Gauge32", "TimeTicks", "IpAddress",
          "Opaque", "Counter"),
        optional($.integer_constraints),
      ),

    integer_constraints: ($) =>
      choice(
        $.range_constraint,
        $.enum_body,
      ),

    range_constraint: ($) =>
      seq(
        "(",
        $.range_spec,
        repeat(seq("|", $.range_spec)),
        ")",
      ),

    range_spec: ($) =>
      seq(
        $._range_value,
        optional(seq("..", $._range_value)),
      ),

    _range_value: ($) =>
      choice($.number, $.negative_number),

    negative_number: ($) => seq("-", $.number),

    enum_body: ($) =>
      seq(
        "{",
        $.enum_value,
        repeat(seq(",", $.enum_value)),
        "}",
      ),

    enum_value: ($) =>
      seq($.identifier, "(", choice($.number, $.negative_number), ")"),

    string_type: ($) =>
      seq("OCTET", "STRING", optional($.size_constraint)),

    size_constraint: ($) =>
      seq(
        "(",
        "SIZE",
        "(",
        $.range_spec,
        repeat(seq("|", $.range_spec)),
        ")",
        ")",
      ),

    bits_type: ($) =>
      seq("BITS", optional($.enum_body)),

    sequence_of_type: ($) =>
      seq("SEQUENCE", "OF", $.identifier),

    named_type: ($) =>
      seq(
        $.identifier,
        optional(
          choice($.range_constraint, $.size_constraint, $.enum_body),
        ),
      ),

    // MODULE-IDENTITY macro
    module_identity_definition: ($) =>
      seq(
        field("name", $.identifier),
        "MODULE-IDENTITY",
        repeat($._module_identity_clause),
        "::=",
        $.object_identifier_value,
      ),

    _module_identity_clause: ($) =>
      choice(
        $.last_updated_clause,
        $.organization_clause,
        $.contact_info_clause,
        $.description_clause,
        $.revision_clause,
      ),

    last_updated_clause: ($) =>
      seq("LAST-UPDATED", $.quoted_string),

    organization_clause: ($) =>
      seq("ORGANIZATION", $.quoted_string),

    contact_info_clause: ($) =>
      seq("CONTACT-INFO", $.quoted_string),

    revision_clause: ($) =>
      seq("REVISION", $.quoted_string, "DESCRIPTION", $.quoted_string),

    // NOTIFICATION-TYPE macro
    notification_type_definition: ($) =>
      seq(
        field("name", $.identifier),
        "NOTIFICATION-TYPE",
        repeat($._notification_type_clause),
        "::=",
        $.object_identifier_value,
      ),

    _notification_type_clause: ($) =>
      choice(
        $.objects_clause,
        $.status_clause,
        $.description_clause,
        $.reference_clause,
      ),

    objects_clause: ($) =>
      seq(
        "OBJECTS",
        "{",
        $.identifier,
        repeat(seq(",", $.identifier)),
        "}",
      ),

    // TRAP-TYPE macro (SMIv1)
    trap_type_definition: ($) =>
      seq(
        field("name", $.identifier),
        "TRAP-TYPE",
        repeat($._trap_type_clause),
        "::=",
        $.number,
      ),

    _trap_type_clause: ($) =>
      choice(
        $.enterprise_clause,
        $.variables_clause,
        $.description_clause,
        $.reference_clause,
      ),

    enterprise_clause: ($) =>
      seq("ENTERPRISE", $.identifier),

    variables_clause: ($) =>
      seq(
        "VARIABLES",
        "{",
        $.identifier,
        repeat(seq(",", $.identifier)),
        "}",
      ),

    // OBJECT-GROUP macro
    object_group_definition: ($) =>
      seq(
        field("name", $.identifier),
        "OBJECT-GROUP",
        repeat($._object_group_clause),
        "::=",
        $.object_identifier_value,
      ),

    _object_group_clause: ($) =>
      choice(
        $.objects_clause,
        $.status_clause,
        $.description_clause,
        $.reference_clause,
      ),

    // MODULE-COMPLIANCE macro
    module_compliance_definition: ($) =>
      seq(
        field("name", $.identifier),
        "MODULE-COMPLIANCE",
        repeat($._module_compliance_clause),
        "::=",
        $.object_identifier_value,
      ),

    _module_compliance_clause: ($) =>
      choice(
        $.status_clause,
        $.description_clause,
        $.reference_clause,
        $.compliance_module_clause,
      ),

    compliance_module_clause: ($) =>
      seq(
        "MODULE",
        optional($.identifier),
        repeat(
          choice(
            $.mandatory_groups_clause,
            $.compliance_group_clause,
            $.compliance_object_clause,
          ),
        ),
      ),

    mandatory_groups_clause: ($) =>
      seq(
        "MANDATORY-GROUPS",
        "{",
        $.identifier,
        repeat(seq(",", $.identifier)),
        "}",
      ),

    compliance_group_clause: ($) =>
      seq(
        "GROUP",
        $.identifier,
        "DESCRIPTION",
        $.quoted_string,
      ),

    compliance_object_clause: ($) =>
      seq(
        "OBJECT",
        $.identifier,
        repeat(
          choice(
            $.syntax_clause,
            seq("MIN-ACCESS", $.access_value),
            $.description_clause,
          ),
        ),
      ),

    // NOTIFICATION-GROUP macro
    notification_group_definition: ($) =>
      seq(
        field("name", $.identifier),
        "NOTIFICATION-GROUP",
        repeat($._notification_group_clause),
        "::=",
        $.object_identifier_value,
      ),

    _notification_group_clause: ($) =>
      choice(
        $.notifications_clause,
        $.status_clause,
        $.description_clause,
        $.reference_clause,
      ),

    notifications_clause: ($) =>
      seq(
        "NOTIFICATIONS",
        "{",
        $.identifier,
        repeat(seq(",", $.identifier)),
        "}",
      ),

    // TEXTUAL-CONVENTION macro
    textual_convention_definition: ($) =>
      seq(
        field("name", $.identifier),
        "::=",
        "TEXTUAL-CONVENTION",
        repeat($._textual_convention_clause),
        "SYNTAX",
        $.syntax_type,
      ),

    _textual_convention_clause: ($) =>
      choice(
        $.display_hint_clause,
        $.status_clause,
        $.description_clause,
        $.reference_clause,
      ),

    // AGENT-CAPABILITIES macro
    agent_capabilities_definition: ($) =>
      seq(
        field("name", $.identifier),
        "AGENT-CAPABILITIES",
        repeat($._agent_capabilities_clause),
        "::=",
        $.object_identifier_value,
      ),

    _agent_capabilities_clause: ($) =>
      choice(
        $.product_release_clause,
        $.status_clause,
        $.description_clause,
        $.reference_clause,
        $.supports_clause,
      ),

    product_release_clause: ($) =>
      seq("PRODUCT-RELEASE", $.quoted_string),

    supports_clause: ($) =>
      seq(
        "SUPPORTS",
        $.identifier,
        "INCLUDES",
        "{",
        $.identifier,
        repeat(seq(",", $.identifier)),
        "}",
        repeat($.variation_clause),
      ),

    variation_clause: ($) =>
      seq(
        "VARIATION",
        $.identifier,
        repeat(
          choice(
            $.syntax_clause,
            seq("WRITE-SYNTAX", $.syntax_type),
            $.access_clause,
            seq("CREATION-REQUIRES", "{", $.identifier, repeat(seq(",", $.identifier)), "}"),
            $.defval_clause,
            $.description_clause,
          ),
        ),
      ),

    // Sequence type definition: TypeName ::= SEQUENCE { ... }
    sequence_definition: ($) =>
      seq(
        field("name", $.identifier),
        "::=",
        "SEQUENCE",
        "{",
        $.sequence_field,
        repeat(seq(",", $.sequence_field)),
        optional(","),
        "}",
      ),

    sequence_field: ($) =>
      seq(field("name", $.identifier), $.syntax_type),

    // Terminals
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_-]*/,

    number: ($) => /[0-9]+/,

    quoted_string: ($) =>
      seq('"', repeat(choice(/[^"]+/, '""')), '"'),

    comment: ($) =>
      token(seq("--", /[^\n]*/)),
  },
});
