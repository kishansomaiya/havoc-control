export as namespace protobuf;

import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace havocai. */
export namespace havocai {

    /** Namespace messages. */
    namespace messages {

        /** Namespace v0. */
        namespace v0 {

            /** Properties of a PlayInstance. */
            interface IPlayInstance {

                /** PlayInstance id */
                id?: (string|null);

                /** PlayInstance team */
                team?: (havocai.messages.v0.ITeam|null);

                /** PlayInstance tasks */
                tasks?: (havocai.messages.v0.ITaskInstance[]|null);

                /** PlayInstance avoidZones */
                avoidZones?: (havocai.messages.v0.IGeoFence[]|null);

                /** PlayInstance avoidanceDistance */
                avoidanceDistance?: (number|null);
            }

            /** Represents a PlayInstance. */
            class PlayInstance implements IPlayInstance {

                /**
                 * Constructs a new PlayInstance.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IPlayInstance);

                /** PlayInstance id. */
                public id: string;

                /** PlayInstance team. */
                public team?: (havocai.messages.v0.ITeam|null);

                /** PlayInstance tasks. */
                public tasks: havocai.messages.v0.ITaskInstance[];

                /** PlayInstance avoidZones. */
                public avoidZones: havocai.messages.v0.IGeoFence[];

                /** PlayInstance avoidanceDistance. */
                public avoidanceDistance: number;

                /**
                 * Creates a new PlayInstance instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PlayInstance instance
                 */
                public static create(properties?: havocai.messages.v0.IPlayInstance): havocai.messages.v0.PlayInstance;

                /**
                 * Encodes the specified PlayInstance message. Does not implicitly {@link havocai.messages.v0.PlayInstance.verify|verify} messages.
                 * @param message PlayInstance message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IPlayInstance, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PlayInstance message, length delimited. Does not implicitly {@link havocai.messages.v0.PlayInstance.verify|verify} messages.
                 * @param message PlayInstance message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IPlayInstance, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PlayInstance message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PlayInstance
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.PlayInstance;

                /**
                 * Decodes a PlayInstance message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PlayInstance
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.PlayInstance;

                /**
                 * Verifies a PlayInstance message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PlayInstance message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PlayInstance
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.PlayInstance;

                /**
                 * Creates a plain object from a PlayInstance message. Also converts values to other types if specified.
                 * @param message PlayInstance
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.PlayInstance, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PlayInstance to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for PlayInstance
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TaskInstance. */
            interface ITaskInstance {

                /** TaskInstance execution */
                execution?: (havocai.messages.v0.ITaskExecution|null);

                /** TaskInstance definition */
                definition?: (havocai.messages.v0.ITaskDefinition|null);
            }

            /** Represents a TaskInstance. */
            class TaskInstance implements ITaskInstance {

                /**
                 * Constructs a new TaskInstance.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ITaskInstance);

                /** TaskInstance execution. */
                public execution?: (havocai.messages.v0.ITaskExecution|null);

                /** TaskInstance definition. */
                public definition?: (havocai.messages.v0.ITaskDefinition|null);

                /**
                 * Creates a new TaskInstance instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TaskInstance instance
                 */
                public static create(properties?: havocai.messages.v0.ITaskInstance): havocai.messages.v0.TaskInstance;

                /**
                 * Encodes the specified TaskInstance message. Does not implicitly {@link havocai.messages.v0.TaskInstance.verify|verify} messages.
                 * @param message TaskInstance message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ITaskInstance, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TaskInstance message, length delimited. Does not implicitly {@link havocai.messages.v0.TaskInstance.verify|verify} messages.
                 * @param message TaskInstance message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ITaskInstance, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TaskInstance message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TaskInstance
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.TaskInstance;

                /**
                 * Decodes a TaskInstance message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TaskInstance
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.TaskInstance;

                /**
                 * Verifies a TaskInstance message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TaskInstance message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TaskInstance
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.TaskInstance;

                /**
                 * Creates a plain object from a TaskInstance message. Also converts values to other types if specified.
                 * @param message TaskInstance
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.TaskInstance, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TaskInstance to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TaskInstance
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a PlayDefinitionSpec. */
            interface IPlayDefinitionSpec {

                /** PlayDefinitionSpec tasks */
                tasks?: (havocai.messages.v0.ITaskDefinition[]|null);
            }

            /** Represents a PlayDefinitionSpec. */
            class PlayDefinitionSpec implements IPlayDefinitionSpec {

                /**
                 * Constructs a new PlayDefinitionSpec.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IPlayDefinitionSpec);

                /** PlayDefinitionSpec tasks. */
                public tasks: havocai.messages.v0.ITaskDefinition[];

                /**
                 * Creates a new PlayDefinitionSpec instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PlayDefinitionSpec instance
                 */
                public static create(properties?: havocai.messages.v0.IPlayDefinitionSpec): havocai.messages.v0.PlayDefinitionSpec;

                /**
                 * Encodes the specified PlayDefinitionSpec message. Does not implicitly {@link havocai.messages.v0.PlayDefinitionSpec.verify|verify} messages.
                 * @param message PlayDefinitionSpec message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IPlayDefinitionSpec, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PlayDefinitionSpec message, length delimited. Does not implicitly {@link havocai.messages.v0.PlayDefinitionSpec.verify|verify} messages.
                 * @param message PlayDefinitionSpec message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IPlayDefinitionSpec, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PlayDefinitionSpec message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PlayDefinitionSpec
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.PlayDefinitionSpec;

                /**
                 * Decodes a PlayDefinitionSpec message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PlayDefinitionSpec
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.PlayDefinitionSpec;

                /**
                 * Verifies a PlayDefinitionSpec message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PlayDefinitionSpec message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PlayDefinitionSpec
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.PlayDefinitionSpec;

                /**
                 * Creates a plain object from a PlayDefinitionSpec message. Also converts values to other types if specified.
                 * @param message PlayDefinitionSpec
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.PlayDefinitionSpec, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PlayDefinitionSpec to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for PlayDefinitionSpec
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TaskDefinition. */
            interface ITaskDefinition {

                /** TaskDefinition id */
                id?: (string|null);

                /** TaskDefinition type */
                type?: (havocai.messages.v0.TaskType|null);

                /** TaskDefinition name */
                name?: (string|null);

                /** TaskDefinition conditionals */
                conditionals?: (havocai.messages.v0.IConditional[]|null);
            }

            /** Represents a TaskDefinition. */
            class TaskDefinition implements ITaskDefinition {

                /**
                 * Constructs a new TaskDefinition.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ITaskDefinition);

                /** TaskDefinition id. */
                public id: string;

                /** TaskDefinition type. */
                public type: havocai.messages.v0.TaskType;

                /** TaskDefinition name. */
                public name: string;

                /** TaskDefinition conditionals. */
                public conditionals: havocai.messages.v0.IConditional[];

                /**
                 * Creates a new TaskDefinition instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TaskDefinition instance
                 */
                public static create(properties?: havocai.messages.v0.ITaskDefinition): havocai.messages.v0.TaskDefinition;

                /**
                 * Encodes the specified TaskDefinition message. Does not implicitly {@link havocai.messages.v0.TaskDefinition.verify|verify} messages.
                 * @param message TaskDefinition message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ITaskDefinition, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TaskDefinition message, length delimited. Does not implicitly {@link havocai.messages.v0.TaskDefinition.verify|verify} messages.
                 * @param message TaskDefinition message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ITaskDefinition, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TaskDefinition message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TaskDefinition
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.TaskDefinition;

                /**
                 * Decodes a TaskDefinition message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TaskDefinition
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.TaskDefinition;

                /**
                 * Verifies a TaskDefinition message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TaskDefinition message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TaskDefinition
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.TaskDefinition;

                /**
                 * Creates a plain object from a TaskDefinition message. Also converts values to other types if specified.
                 * @param message TaskDefinition
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.TaskDefinition, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TaskDefinition to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TaskDefinition
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Conditional. */
            interface IConditional {

                /** Conditional id */
                id?: (string|null);

                /** Conditional command */
                command?: (havocai.messages.v0.ICommandConditional|null);
            }

            /** Represents a Conditional. */
            class Conditional implements IConditional {

                /**
                 * Constructs a new Conditional.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IConditional);

                /** Conditional id. */
                public id: string;

                /** Conditional command. */
                public command?: (havocai.messages.v0.ICommandConditional|null);

                /** Conditional conditional. */
                public conditional?: "command";

                /**
                 * Creates a new Conditional instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Conditional instance
                 */
                public static create(properties?: havocai.messages.v0.IConditional): havocai.messages.v0.Conditional;

                /**
                 * Encodes the specified Conditional message. Does not implicitly {@link havocai.messages.v0.Conditional.verify|verify} messages.
                 * @param message Conditional message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IConditional, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Conditional message, length delimited. Does not implicitly {@link havocai.messages.v0.Conditional.verify|verify} messages.
                 * @param message Conditional message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IConditional, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Conditional message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Conditional
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Conditional;

                /**
                 * Decodes a Conditional message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Conditional
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Conditional;

                /**
                 * Verifies a Conditional message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Conditional message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Conditional
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Conditional;

                /**
                 * Creates a plain object from a Conditional message. Also converts values to other types if specified.
                 * @param message Conditional
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Conditional, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Conditional to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Conditional
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a CommandConditional. */
            interface ICommandConditional {

                /** CommandConditional targetCommand */
                targetCommand?: (havocai.messages.v0.Command|null);
            }

            /** Represents a CommandConditional. */
            class CommandConditional implements ICommandConditional {

                /**
                 * Constructs a new CommandConditional.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ICommandConditional);

                /** CommandConditional targetCommand. */
                public targetCommand: havocai.messages.v0.Command;

                /**
                 * Creates a new CommandConditional instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns CommandConditional instance
                 */
                public static create(properties?: havocai.messages.v0.ICommandConditional): havocai.messages.v0.CommandConditional;

                /**
                 * Encodes the specified CommandConditional message. Does not implicitly {@link havocai.messages.v0.CommandConditional.verify|verify} messages.
                 * @param message CommandConditional message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ICommandConditional, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified CommandConditional message, length delimited. Does not implicitly {@link havocai.messages.v0.CommandConditional.verify|verify} messages.
                 * @param message CommandConditional message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ICommandConditional, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a CommandConditional message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns CommandConditional
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.CommandConditional;

                /**
                 * Decodes a CommandConditional message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns CommandConditional
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.CommandConditional;

                /**
                 * Verifies a CommandConditional message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a CommandConditional message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns CommandConditional
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.CommandConditional;

                /**
                 * Creates a plain object from a CommandConditional message. Also converts values to other types if specified.
                 * @param message CommandConditional
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.CommandConditional, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this CommandConditional to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for CommandConditional
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TaskExecution. */
            interface ITaskExecution {

                /** TaskExecution id */
                id?: (string|null);

                /** TaskExecution taskDefinition */
                taskDefinition?: (string|null);

                /** TaskExecution route */
                route?: (havocai.messages.v0.IRouteParams|null);

                /** TaskExecution search */
                search?: (havocai.messages.v0.ISearchParams|null);

                /** TaskExecution engage */
                engage?: (havocai.messages.v0.IEngageParams|null);

                /** TaskExecution geoFormation */
                geoFormation?: (havocai.messages.v0.IGeoFormationParams|null);

                /** TaskExecution escort */
                escort?: (havocai.messages.v0.IEscortParams|null);

                /** TaskExecution checkout */
                checkout?: (havocai.messages.v0.ICheckoutParams|null);

                /** TaskExecution patrol */
                patrol?: (havocai.messages.v0.IPatrolParams|null);

                /** TaskExecution drift */
                drift?: (havocai.messages.v0.IDriftParams|null);
            }

            /** Represents a TaskExecution. */
            class TaskExecution implements ITaskExecution {

                /**
                 * Constructs a new TaskExecution.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ITaskExecution);

                /** TaskExecution id. */
                public id: string;

                /** TaskExecution taskDefinition. */
                public taskDefinition: string;

                /** TaskExecution route. */
                public route?: (havocai.messages.v0.IRouteParams|null);

                /** TaskExecution search. */
                public search?: (havocai.messages.v0.ISearchParams|null);

                /** TaskExecution engage. */
                public engage?: (havocai.messages.v0.IEngageParams|null);

                /** TaskExecution geoFormation. */
                public geoFormation?: (havocai.messages.v0.IGeoFormationParams|null);

                /** TaskExecution escort. */
                public escort?: (havocai.messages.v0.IEscortParams|null);

                /** TaskExecution checkout. */
                public checkout?: (havocai.messages.v0.ICheckoutParams|null);

                /** TaskExecution patrol. */
                public patrol?: (havocai.messages.v0.IPatrolParams|null);

                /** TaskExecution drift. */
                public drift?: (havocai.messages.v0.IDriftParams|null);

                /** TaskExecution params. */
                public params?: ("route"|"search"|"engage"|"geoFormation"|"escort"|"checkout"|"patrol"|"drift");

                /**
                 * Creates a new TaskExecution instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TaskExecution instance
                 */
                public static create(properties?: havocai.messages.v0.ITaskExecution): havocai.messages.v0.TaskExecution;

                /**
                 * Encodes the specified TaskExecution message. Does not implicitly {@link havocai.messages.v0.TaskExecution.verify|verify} messages.
                 * @param message TaskExecution message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ITaskExecution, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TaskExecution message, length delimited. Does not implicitly {@link havocai.messages.v0.TaskExecution.verify|verify} messages.
                 * @param message TaskExecution message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ITaskExecution, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TaskExecution message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TaskExecution
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.TaskExecution;

                /**
                 * Decodes a TaskExecution message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TaskExecution
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.TaskExecution;

                /**
                 * Verifies a TaskExecution message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TaskExecution message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TaskExecution
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.TaskExecution;

                /**
                 * Creates a plain object from a TaskExecution message. Also converts values to other types if specified.
                 * @param message TaskExecution
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.TaskExecution, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TaskExecution to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TaskExecution
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a RouteParams. */
            interface IRouteParams {

                /** RouteParams route */
                route?: (havocai.messages.v0.IRoute|null);
            }

            /** Represents a RouteParams. */
            class RouteParams implements IRouteParams {

                /**
                 * Constructs a new RouteParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IRouteParams);

                /** RouteParams route. */
                public route?: (havocai.messages.v0.IRoute|null);

                /**
                 * Creates a new RouteParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns RouteParams instance
                 */
                public static create(properties?: havocai.messages.v0.IRouteParams): havocai.messages.v0.RouteParams;

                /**
                 * Encodes the specified RouteParams message. Does not implicitly {@link havocai.messages.v0.RouteParams.verify|verify} messages.
                 * @param message RouteParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IRouteParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified RouteParams message, length delimited. Does not implicitly {@link havocai.messages.v0.RouteParams.verify|verify} messages.
                 * @param message RouteParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IRouteParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a RouteParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns RouteParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.RouteParams;

                /**
                 * Decodes a RouteParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns RouteParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.RouteParams;

                /**
                 * Verifies a RouteParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a RouteParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns RouteParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.RouteParams;

                /**
                 * Creates a plain object from a RouteParams message. Also converts values to other types if specified.
                 * @param message RouteParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.RouteParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this RouteParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for RouteParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a SearchParams. */
            interface ISearchParams {

                /** SearchParams zone */
                zone?: (havocai.messages.v0.IResourceRef|null);

                /** SearchParams polygon */
                polygon?: (havocai.messages.v0.IPolygon|null);

                /** SearchParams searchStrategy */
                searchStrategy?: (havocai.messages.v0.SearchStrategy|null);

                /** SearchParams targetSpeed */
                targetSpeed?: (number|null);

                /** SearchParams sensorRadius */
                sensorRadius?: (number|null);

                /** SearchParams indefiniteExecution */
                indefiniteExecution?: (boolean|null);

                /** SearchParams altitude */
                altitude?: (number|null);
            }

            /** Represents a SearchParams. */
            class SearchParams implements ISearchParams {

                /**
                 * Constructs a new SearchParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ISearchParams);

                /** SearchParams zone. */
                public zone?: (havocai.messages.v0.IResourceRef|null);

                /** SearchParams polygon. */
                public polygon?: (havocai.messages.v0.IPolygon|null);

                /** SearchParams searchStrategy. */
                public searchStrategy: havocai.messages.v0.SearchStrategy;

                /** SearchParams targetSpeed. */
                public targetSpeed: number;

                /** SearchParams sensorRadius. */
                public sensorRadius: number;

                /** SearchParams indefiniteExecution. */
                public indefiniteExecution: boolean;

                /** SearchParams altitude. */
                public altitude?: (number|null);

                /** SearchParams searchArea. */
                public searchArea?: ("zone"|"polygon");

                /** SearchParams _altitude. */
                public _altitude?: "altitude";

                /**
                 * Creates a new SearchParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SearchParams instance
                 */
                public static create(properties?: havocai.messages.v0.ISearchParams): havocai.messages.v0.SearchParams;

                /**
                 * Encodes the specified SearchParams message. Does not implicitly {@link havocai.messages.v0.SearchParams.verify|verify} messages.
                 * @param message SearchParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ISearchParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SearchParams message, length delimited. Does not implicitly {@link havocai.messages.v0.SearchParams.verify|verify} messages.
                 * @param message SearchParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ISearchParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SearchParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SearchParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.SearchParams;

                /**
                 * Decodes a SearchParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SearchParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.SearchParams;

                /**
                 * Verifies a SearchParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SearchParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SearchParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.SearchParams;

                /**
                 * Creates a plain object from a SearchParams message. Also converts values to other types if specified.
                 * @param message SearchParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.SearchParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SearchParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for SearchParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a PatrolParams. */
            interface IPatrolParams {

                /** PatrolParams zone */
                zone?: (havocai.messages.v0.IResourceRef|null);

                /** PatrolParams polygon */
                polygon?: (havocai.messages.v0.IPolygon|null);

                /** PatrolParams route */
                route?: (havocai.messages.v0.IRoute|null);

                /** PatrolParams direction */
                direction?: (havocai.messages.v0.RotationDirection|null);

                /** PatrolParams targetSpeed */
                targetSpeed?: (number|null);

                /** PatrolParams altitude */
                altitude?: (number|null);
            }

            /** Represents a PatrolParams. */
            class PatrolParams implements IPatrolParams {

                /**
                 * Constructs a new PatrolParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IPatrolParams);

                /** PatrolParams zone. */
                public zone?: (havocai.messages.v0.IResourceRef|null);

                /** PatrolParams polygon. */
                public polygon?: (havocai.messages.v0.IPolygon|null);

                /** PatrolParams route. */
                public route?: (havocai.messages.v0.IRoute|null);

                /** PatrolParams direction. */
                public direction: havocai.messages.v0.RotationDirection;

                /** PatrolParams targetSpeed. */
                public targetSpeed: number;

                /** PatrolParams altitude. */
                public altitude?: (number|null);

                /** PatrolParams patrolArea. */
                public patrolArea?: ("zone"|"polygon"|"route");

                /** PatrolParams _altitude. */
                public _altitude?: "altitude";

                /**
                 * Creates a new PatrolParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PatrolParams instance
                 */
                public static create(properties?: havocai.messages.v0.IPatrolParams): havocai.messages.v0.PatrolParams;

                /**
                 * Encodes the specified PatrolParams message. Does not implicitly {@link havocai.messages.v0.PatrolParams.verify|verify} messages.
                 * @param message PatrolParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IPatrolParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PatrolParams message, length delimited. Does not implicitly {@link havocai.messages.v0.PatrolParams.verify|verify} messages.
                 * @param message PatrolParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IPatrolParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PatrolParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PatrolParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.PatrolParams;

                /**
                 * Decodes a PatrolParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PatrolParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.PatrolParams;

                /**
                 * Verifies a PatrolParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PatrolParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PatrolParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.PatrolParams;

                /**
                 * Creates a plain object from a PatrolParams message. Also converts values to other types if specified.
                 * @param message PatrolParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.PatrolParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PatrolParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for PatrolParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a GeoFormationParams. */
            interface IGeoFormationParams {

                /** GeoFormationParams formation */
                formation?: (havocai.messages.v0.ICooperativeOffset|null);

                /** GeoFormationParams musterPoint */
                musterPoint?: (havocai.messages.v0.IGeoPoint|null);

                /** GeoFormationParams targetSpeed */
                targetSpeed?: (number|null);

                /** GeoFormationParams altitude */
                altitude?: (number|null);
            }

            /** Represents a GeoFormationParams. */
            class GeoFormationParams implements IGeoFormationParams {

                /**
                 * Constructs a new GeoFormationParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IGeoFormationParams);

                /** GeoFormationParams formation. */
                public formation?: (havocai.messages.v0.ICooperativeOffset|null);

                /** GeoFormationParams musterPoint. */
                public musterPoint?: (havocai.messages.v0.IGeoPoint|null);

                /** GeoFormationParams targetSpeed. */
                public targetSpeed: number;

                /** GeoFormationParams altitude. */
                public altitude?: (number|null);

                /** GeoFormationParams _musterPoint. */
                public _musterPoint?: "musterPoint";

                /** GeoFormationParams _altitude. */
                public _altitude?: "altitude";

                /**
                 * Creates a new GeoFormationParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns GeoFormationParams instance
                 */
                public static create(properties?: havocai.messages.v0.IGeoFormationParams): havocai.messages.v0.GeoFormationParams;

                /**
                 * Encodes the specified GeoFormationParams message. Does not implicitly {@link havocai.messages.v0.GeoFormationParams.verify|verify} messages.
                 * @param message GeoFormationParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IGeoFormationParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified GeoFormationParams message, length delimited. Does not implicitly {@link havocai.messages.v0.GeoFormationParams.verify|verify} messages.
                 * @param message GeoFormationParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IGeoFormationParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a GeoFormationParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns GeoFormationParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.GeoFormationParams;

                /**
                 * Decodes a GeoFormationParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns GeoFormationParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.GeoFormationParams;

                /**
                 * Verifies a GeoFormationParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a GeoFormationParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns GeoFormationParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.GeoFormationParams;

                /**
                 * Creates a plain object from a GeoFormationParams message. Also converts values to other types if specified.
                 * @param message GeoFormationParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.GeoFormationParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this GeoFormationParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for GeoFormationParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an EscortParams. */
            interface IEscortParams {

                /** EscortParams formation */
                formation?: (havocai.messages.v0.ICooperativeOffset|null);

                /** EscortParams targetTrack */
                targetTrack?: (havocai.messages.v0.IResourceRef|null);

                /** EscortParams targetSpeed */
                targetSpeed?: (number|null);

                /** EscortParams altitude */
                altitude?: (number|null);
            }

            /** Represents an EscortParams. */
            class EscortParams implements IEscortParams {

                /**
                 * Constructs a new EscortParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IEscortParams);

                /** EscortParams formation. */
                public formation?: (havocai.messages.v0.ICooperativeOffset|null);

                /** EscortParams targetTrack. */
                public targetTrack?: (havocai.messages.v0.IResourceRef|null);

                /** EscortParams targetSpeed. */
                public targetSpeed: number;

                /** EscortParams altitude. */
                public altitude?: (number|null);

                /** EscortParams _altitude. */
                public _altitude?: "altitude";

                /**
                 * Creates a new EscortParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns EscortParams instance
                 */
                public static create(properties?: havocai.messages.v0.IEscortParams): havocai.messages.v0.EscortParams;

                /**
                 * Encodes the specified EscortParams message. Does not implicitly {@link havocai.messages.v0.EscortParams.verify|verify} messages.
                 * @param message EscortParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IEscortParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified EscortParams message, length delimited. Does not implicitly {@link havocai.messages.v0.EscortParams.verify|verify} messages.
                 * @param message EscortParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IEscortParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an EscortParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns EscortParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.EscortParams;

                /**
                 * Decodes an EscortParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns EscortParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.EscortParams;

                /**
                 * Verifies an EscortParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an EscortParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns EscortParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.EscortParams;

                /**
                 * Creates a plain object from an EscortParams message. Also converts values to other types if specified.
                 * @param message EscortParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.EscortParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this EscortParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for EscortParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an EngageParams. */
            interface IEngageParams {

                /** EngageParams zone */
                zone?: (havocai.messages.v0.IResourceRef|null);

                /** EngageParams polygon */
                polygon?: (havocai.messages.v0.IPolygon|null);

                /** EngageParams track */
                track?: (havocai.messages.v0.IResourceRef|null);

                /** EngageParams trackCriteria */
                trackCriteria?: (havocai.messages.v0.ITrackCriteria|null);

                /** EngageParams targetSpeed */
                targetSpeed?: (number|null);

                /** EngageParams engagementRatio */
                engagementRatio?: (number|null);

                /** EngageParams engagementMode */
                engagementMode?: (havocai.messages.v0.EngagementMode|null);

                /** EngageParams standoffDistance */
                standoffDistance?: (number|null);

                /** EngageParams engagementDistance */
                engagementDistance?: (number|null);

                /** EngageParams altitude */
                altitude?: (number|null);
            }

            /** Represents an EngageParams. */
            class EngageParams implements IEngageParams {

                /**
                 * Constructs a new EngageParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IEngageParams);

                /** EngageParams zone. */
                public zone?: (havocai.messages.v0.IResourceRef|null);

                /** EngageParams polygon. */
                public polygon?: (havocai.messages.v0.IPolygon|null);

                /** EngageParams track. */
                public track?: (havocai.messages.v0.IResourceRef|null);

                /** EngageParams trackCriteria. */
                public trackCriteria?: (havocai.messages.v0.ITrackCriteria|null);

                /** EngageParams targetSpeed. */
                public targetSpeed: number;

                /** EngageParams engagementRatio. */
                public engagementRatio: number;

                /** EngageParams engagementMode. */
                public engagementMode: havocai.messages.v0.EngagementMode;

                /** EngageParams standoffDistance. */
                public standoffDistance?: (number|null);

                /** EngageParams engagementDistance. */
                public engagementDistance?: (number|null);

                /** EngageParams altitude. */
                public altitude?: (number|null);

                /** EngageParams engagementArea. */
                public engagementArea?: ("zone"|"polygon");

                /** EngageParams target. */
                public target?: ("track"|"trackCriteria");

                /** EngageParams _standoffDistance. */
                public _standoffDistance?: "standoffDistance";

                /** EngageParams _engagementDistance. */
                public _engagementDistance?: "engagementDistance";

                /** EngageParams _altitude. */
                public _altitude?: "altitude";

                /**
                 * Creates a new EngageParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns EngageParams instance
                 */
                public static create(properties?: havocai.messages.v0.IEngageParams): havocai.messages.v0.EngageParams;

                /**
                 * Encodes the specified EngageParams message. Does not implicitly {@link havocai.messages.v0.EngageParams.verify|verify} messages.
                 * @param message EngageParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IEngageParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified EngageParams message, length delimited. Does not implicitly {@link havocai.messages.v0.EngageParams.verify|verify} messages.
                 * @param message EngageParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IEngageParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an EngageParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns EngageParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.EngageParams;

                /**
                 * Decodes an EngageParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns EngageParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.EngageParams;

                /**
                 * Verifies an EngageParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an EngageParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns EngageParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.EngageParams;

                /**
                 * Creates a plain object from an EngageParams message. Also converts values to other types if specified.
                 * @param message EngageParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.EngageParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this EngageParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for EngageParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a DriftParams. */
            interface IDriftParams {

                /** DriftParams driftRadius */
                driftRadius?: (number|null);

                /** DriftParams driftReferencePosition */
                driftReferencePosition?: (havocai.messages.v0.IGeoPoint|null);

                /** DriftParams speed */
                speed?: (number|null);
            }

            /** Represents a DriftParams. */
            class DriftParams implements IDriftParams {

                /**
                 * Constructs a new DriftParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IDriftParams);

                /** DriftParams driftRadius. */
                public driftRadius: number;

                /** DriftParams driftReferencePosition. */
                public driftReferencePosition?: (havocai.messages.v0.IGeoPoint|null);

                /** DriftParams speed. */
                public speed: number;

                /**
                 * Creates a new DriftParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DriftParams instance
                 */
                public static create(properties?: havocai.messages.v0.IDriftParams): havocai.messages.v0.DriftParams;

                /**
                 * Encodes the specified DriftParams message. Does not implicitly {@link havocai.messages.v0.DriftParams.verify|verify} messages.
                 * @param message DriftParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IDriftParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DriftParams message, length delimited. Does not implicitly {@link havocai.messages.v0.DriftParams.verify|verify} messages.
                 * @param message DriftParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IDriftParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DriftParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DriftParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.DriftParams;

                /**
                 * Decodes a DriftParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DriftParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.DriftParams;

                /**
                 * Verifies a DriftParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DriftParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DriftParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.DriftParams;

                /**
                 * Creates a plain object from a DriftParams message. Also converts values to other types if specified.
                 * @param message DriftParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.DriftParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DriftParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for DriftParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TrackCriteria. */
            interface ITrackCriteria {

                /** TrackCriteria trackTypes */
                trackTypes?: (havocai.messages.v0.TrackType[]|null);

                /** TrackCriteria trackAffiliations */
                trackAffiliations?: (havocai.messages.v0.Affiliation[]|null);

                /** TrackCriteria trackAffiliationConfidence */
                trackAffiliationConfidence?: (number|null);
            }

            /** Represents a TrackCriteria. */
            class TrackCriteria implements ITrackCriteria {

                /**
                 * Constructs a new TrackCriteria.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ITrackCriteria);

                /** TrackCriteria trackTypes. */
                public trackTypes: havocai.messages.v0.TrackType[];

                /** TrackCriteria trackAffiliations. */
                public trackAffiliations: havocai.messages.v0.Affiliation[];

                /** TrackCriteria trackAffiliationConfidence. */
                public trackAffiliationConfidence: number;

                /**
                 * Creates a new TrackCriteria instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TrackCriteria instance
                 */
                public static create(properties?: havocai.messages.v0.ITrackCriteria): havocai.messages.v0.TrackCriteria;

                /**
                 * Encodes the specified TrackCriteria message. Does not implicitly {@link havocai.messages.v0.TrackCriteria.verify|verify} messages.
                 * @param message TrackCriteria message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ITrackCriteria, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TrackCriteria message, length delimited. Does not implicitly {@link havocai.messages.v0.TrackCriteria.verify|verify} messages.
                 * @param message TrackCriteria message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ITrackCriteria, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TrackCriteria message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TrackCriteria
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.TrackCriteria;

                /**
                 * Decodes a TrackCriteria message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TrackCriteria
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.TrackCriteria;

                /**
                 * Verifies a TrackCriteria message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TrackCriteria message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TrackCriteria
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.TrackCriteria;

                /**
                 * Creates a plain object from a TrackCriteria message. Also converts values to other types if specified.
                 * @param message TrackCriteria
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.TrackCriteria, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TrackCriteria to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TrackCriteria
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Affiliation enum. */
            enum Affiliation {
                AFFILIATION_UNKNOWN = 0,
                AFFILIATION_ASSUMED_FRIENDLY = 1,
                AFFILIATION_FRIENDLY = 2,
                AFFILIATION_NEUTRAL = 3,
                AFFILIATION_SUSPECT = 4,
                AFFILIATION_HOSTILE = 5
            }

            /** BoatManeuver enum. */
            enum BoatManeuver {
                BOAT_MANEUVER_UNKNOWN = 0,
                BOAT_MANEUVER_MOVE = 1,
                BOAT_MANEUVER_WAIT = 2
            }

            /** Command enum. */
            enum Command {
                COMMAND_UNKNOWN = 0,
                COMMAND_CANCEL = 1,
                COMMAND_GO = 2,
                COMMAND_AUTHORIZE = 3,
                COMMAND_CUSTOM = 4,
                COMMAND_AUTHORIZE_TASK = 5,
                COMMAND_EXECUTE_TASK = 6,
                COMMAND_TRIGGER_PAYLOAD = 7
            }

            /** ComponentKey enum. */
            enum ComponentKey {
                COMPONENT_KEY_UNKNOWN = 0,
                COMPONENT_KEY_BATTERY = 1,
                COMPONENT_KEY_COMMS = 2,
                COMPONENT_KEY_SENSORS = 3,
                COMPONENT_KEY_GPS = 4,
                COMPONENT_KEY_MISSION_MANAGER = 5
            }

            /** CooperativeConfig enum. */
            enum CooperativeConfig {
                COOPERATIVE_CONFIG_UNKNOWN = 0,
                COOPERATIVE_CONFIG_CIRCLE = 1,
                COOPERATIVE_CONFIG_LINE = 2,
                COOPERATIVE_CONFIG_BLOCKADE = 3,
                COOPERATIVE_CONFIG_ELLIPSE = 4
            }

            /** CredibilityRating enum. */
            enum CredibilityRating {
                CREDIBILITY_UNKNOWN = 0,
                CREDIBILITY_IMPROBABLE = 1,
                CREDIBILITY_DOUBTFUL = 2,
                CREDIBILITY_POSSIBLE = 3,
                CREDIBILITY_PROBABLE = 4,
                CREDIBILITY_CONFIRMED = 5
            }

            /** Encoding enum. */
            enum Encoding {
                ENCODING_JSON = 0,
                ENCODING_PROTOBUF = 1
            }

            /** TrackType enum. */
            enum TrackType {
                TRACK_TYPE_UNKNOWN = 0,
                TRACK_TYPE_AIS = 1,
                TRACK_TYPE_RADAR = 2,
                TRACK_TYPE_EO = 3,
                TRACK_TYPE_FUSED = 4,
                TRACK_TYPE_USER_CREATED = 5,
                TRACK_TYPE_EXTERNAL_SYSTEM = 6,
                TRACK_TYPE_RF = 7,
                TRACK_TYPE_PERSON = 8,
                TRACK_TYPE_MISSILE = 9,
                TRACK_TYPE_TORPEDO = 10,
                TRACK_TYPE_RUBBER_DUCKIE = 98,
                TRACK_TYPE_NERF_DART = 99
            }

            /** ErrorLevel enum. */
            enum ErrorLevel {
                ERROR_LEVEL_UNKNOWN = 0,
                ERROR_LEVEL_WARNING = 1,
                ERROR_LEVEL_MINOR = 2,
                ERROR_LEVEL_MAJOR = 3,
                ERROR_LEVEL_CRITICAL = 4
            }

            /** EventType enum. */
            enum EventType {
                EVENT_TYPE_UNKNOWN = 0,
                EVENT_TYPE_NOTIFICATION = 1,
                EVENT_TYPE_RESOURCE_CREATED = 2,
                EVENT_TYPE_RESOURCE_UPDATED = 3,
                EVENT_TYPE_RESOURCE_DELETED = 4
            }

            /** GeoFenceType enum. */
            enum GeoFenceType {
                GEO_FENCE_TYPE_UNKNOWN = 0,
                GEO_FENCE_TYPE_RESTRICTED = 1,
                GEO_FENCE_TYPE_REQUIRED = 2,
                GEO_FENCE_TYPE_PERMITTED = 3,
                GEO_FENCE_TYPE_PREFERRED = 4
            }

            /** Health enum. */
            enum Health {
                HEALTH_UNKNOWN = 0,
                HEALTH_HEALTHY = 1,
                HEALTH_DEGRADED = 2,
                HEALTH_FATAL = 3
            }

            /** MetricKey enum. */
            enum MetricKey {
                METRIC_KEY_UNKNOWN = 0,
                METRIC_KEY_VOLTAGE = 1,
                METRIC_KEY_POWER = 2,
                METRIC_KEY_ENERGY_CAPACITY = 3,
                METRIC_KEY_ENERGY_REMAINING = 4,
                METRIC_KEY_BATTERY_CHARGE = 5,
                METRIC_KEY_SENSOR_RANGE = 6,
                METRIC_KEY_BATTERY_CURRENT = 7,
                METRIC_KEY_BATTERY_TEMPERATURE = 8
            }

            /** MetricType enum. */
            enum MetricType {
                METRIC_TYPE_UNKNOWN = 0,
                METRIC_TYPE_BOOL = 1,
                METRIC_TYPE_NUMBER = 2,
                METRIC_TYPE_PERCENTAGE = 3
            }

            /** PlayKey enum. */
            enum PlayKey {
                PLAY_KEY_UNKNOWN = 0,
                PLAY_KEY_NONE = 1,
                PLAY_KEY_DIRECT = 2,
                PLAY_KEY_CONTESTED_LOGISTICS = 3,
                PLAY_KEY_PAYLOAD_ORCHESTRATION = 4,
                PLAY_KEY_FIND_FIX_INVESTIGATE = 5,
                PLAY_KEY_FIND_FIX_INVESTIGATE_EPISCI = 6,
                PLAY_KEY_CHECKOUT = 7,
                PLAY_KEY_BEACH_LAUNCH = 8,
                PLAY_KEY_AVAST = 9,
                PLAY_KEY_JAZZ = 10,
                PLAY_KEY_CHARIOT_RAMP_CONTROL = 11,
                PLAY_KEY_CHARIOT_RESUPPLY = 12,
                PLAY_KEY_ENGAGE_TRACK = 13,
                PLAY_KEY_DYNAMIC = 14
            }

            /** DataSource enum. */
            enum DataSource {
                DATA_SOURCE_UNKNOWN = 0,
                DATA_SOURCE_API = 1,
                DATA_SOURCE_TAK = 2,
                DATA_SOURCE_LATTICE = 3
            }

            /** PlayState enum. */
            enum PlayState {
                PLAY_STATE_UNKNOWN = 0,
                PLAY_STATE_IDLE = 1,
                PLAY_STATE_PENDING = 2,
                PLAY_STATE_ACTIVE = 3,
                PLAY_STATE_COMPLETE = 4,
                PLAY_STATE_CANCELED = 5,
                PLAY_STATE_FAILED = 6
            }

            /** TaskState enum. */
            enum TaskState {
                TASK_STATE_UNKNOWN = 0,
                TASK_STATE_ACTIVE = 1,
                TASK_STATE_AWAITING_CONDITIONAL = 2,
                TASK_STATE_COMPLETE = 3,
                TASK_STATE_CANCELED = 4,
                TASK_STATE_FAILED = 5
            }

            /** ResourceKind enum. */
            enum ResourceKind {
                RESOURCE_KIND_UNKNOWN = 0,
                RESOURCE_KIND_SECTOR = 1,
                RESOURCE_KIND_ZONE = 2,
                RESOURCE_KIND_TEAM = 3,
                RESOURCE_KIND_BOAT = 4,
                RESOURCE_KIND_TRACK = 6,
                RESOURCE_KIND_PLAY_DEFINITION = 7,
                RESOURCE_KIND_PLAY_EXECUTION = 8,
                RESOURCE_KIND_PLAY_RUNNER = 9,
                RESOURCE_KIND_SIMULATION = 10
            }

            /** TaskKey enum. */
            enum TaskKey {
                TASK_KEY_UNKNOWN = 0,
                TASK_KEY_NONE = 1,
                TASK_KEY_DIRECT_MOVE_GOAL = 2,
                TASK_KEY_CONTESTED_LOGISTICS_MOVE_PICKUP_STAGING = 3,
                TASK_KEY_CONTESTED_LOGISTICS_WAIT_PICKUP_STAGING = 4,
                TASK_KEY_CONTESTED_LOGISTICS_MOVE_PICKUP_LANDING = 5,
                TASK_KEY_CONTESTED_LOGISTICS_WAIT_PICKUP_LANDING = 6,
                TASK_KEY_CONTESTED_LOGISTICS_MOVE_PICKUP_EGRESS = 7,
                TASK_KEY_CONTESTED_LOGISTICS_WAIT_PICKUP_EGRESS = 8,
                TASK_KEY_CONTESTED_LOGISTICS_MOVE_DROPOFF_STAGING = 9,
                TASK_KEY_CONTESTED_LOGISTICS_WAIT_DROPOFF_STAGING = 10,
                TASK_KEY_CONTESTED_LOGISTICS_MOVE_DROPOFF_LANDING = 11,
                TASK_KEY_CONTESTED_LOGISTICS_WAIT_DROPOFF_LANDING = 12,
                TASK_KEY_CONTESTED_LOGISTICS_MOVE_DROPOFF_EGRESS = 13,
                TASK_KEY_CONTESTED_LOGISTICS_WAIT_DROPOFF_EGRESS = 14,
                TASK_KEY_CONTESTED_LOGISTICS_MOVE_PICKUP = 15,
                TASK_KEY_PAYLOAD_ORCHESTRATION_MOVE_TRACK = 16,
                TASK_KEY_FIND_FIX_INVESTIGATE_FIND_TRACK = 17,
                TASK_KEY_FIND_FIX_INVESTIGATE_INVESTIGATE_TRACK = 18,
                TASK_KEY_CHECKOUT_WAIT = 19,
                TASK_KEY_CHECKOUT_TEST_DRIVE = 20,
                TASK_KEY_BEACH_LAUNCH_WAIT = 21,
                TASK_KEY_BEACH_LAUNCH_DEPLOY = 22,
                TASK_KEY_BEACH_LAUNCH_MOVE_EGRESS = 23,
                TASK_KEY_AVAST_WAIT = 24,
                TASK_KEY_JAZZ_ACTIVE = 25,
                TASK_KEY_CHARIOT_RAMP_CONTROL_ACTIVE = 26,
                TASK_KEY_CHARIOT_RESUPPLY_MOVE_TO_STAGING = 27,
                TASK_KEY_CHARIOT_RESUPPLY_MOVE_TO_SHORE = 28,
                TASK_KEY_CHARIOT_RESUPPLY_LANDING_CONFIRMATION = 29,
                TASK_KEY_CHARIOT_RESUPPLY_DEPART_CONFIRMATION = 30,
                TASK_KEY_CHARIOT_RESUPPLY_MOVE_OFF_SHORE = 31,
                TASK_KEY_CHARIOT_RESUPPLY_MOVE_TO_EGRESS = 32,
                TASK_KEY_ENGAGE_TRACK = 33
            }

            /** WaypointType enum. */
            enum WaypointType {
                WAYPOINT_TYPE_UNKNOWN = 0,
                WAYPOINT_TYPE_LANDING = 1,
                WAYPOINT_TYPE_EGRESS = 2,
                WAYPOINT_TYPE_STAGING = 3
            }

            /** MarkerType enum. */
            enum MarkerType {
                MARKER_TYPE_UNKNOWN = 0,
                MARKER_TYPE_LANDING = 1,
                MARKER_TYPE_EGRESS = 2,
                MARKER_TYPE_STAGING = 3,
                MARKER_TYPE_LANDMARK = 4,
                MARKER_TYPE_HAZARD = 5
            }

            /** ZoneType enum. */
            enum ZoneType {
                ZONE_TYPE_UNKNOWN = 0,
                ZONE_TYPE_BEACH = 1,
                ZONE_TYPE_OVERLAY = 2,
                ZONE_TYPE_ENGAGEMENT = 3,
                ZONE_TYPE_ROUTE = 4
            }

            /** VehicleType enum. */
            enum VehicleType {
                VEHICLE_TYPE_UNKNOWN = 0,
                VEHICLE_TYPE_BOAT = 1,
                VEHICLE_TYPE_ROVER = 2,
                VEHICLE_TYPE_BARGE = 3,
                VEHICLE_TYPE_AERIAL_OTHER = 4,
                VEHICLE_TYPE_AERIAL_MULTIROTOR = 5,
                VEHICLE_TYPE_AERIAL_FIXED_WING = 6,
                VEHICLE_TYPE_AERIAL_HELICOPTER = 7,
                VEHICLE_TYPE_AERIAL_AIRSHIP = 8,
                VEHICLE_TYPE_GROUND_OTHER = 9,
                VEHICLE_TYPE_GROUND_WHEELED = 10,
                VEHICLE_TYPE_GROUND_TRACKED = 11,
                VEHICLE_TYPE_GROUND_LEGGED = 12,
                VEHICLE_TYPE_SURFACE_OTHER = 13,
                VEHICLE_TYPE_SURFACE_VESSEL = 14,
                VEHICLE_TYPE_SURFACE_HOVERCRAFT = 15,
                VEHICLE_TYPE_SURFACE_AMPHIBIOUS = 16,
                VEHICLE_TYPE_UNDERWATER_OTHER = 17,
                VEHICLE_TYPE_SURFACE_RUBBER_DUCKIE = 99
            }

            /** SearchStrategy enum. */
            enum SearchStrategy {
                SEARCH_STRATEGY_UNKNOWN = 0,
                SEARCH_STRATEGY_RANDOM = 1,
                SEARCH_STRATEGY_SWEEP = 2,
                SEARCH_STRATEGY_SPIRAL = 3
            }

            /** ActuatorPositionGoal enum. */
            enum ActuatorPositionGoal {
                ACTUATOR_POSITION_GOAL_UNKNOWN = 0,
                ACTUATOR_POSITION_GOAL_EXTENDED = 1,
                ACTUATOR_POSITION_GOAL_RETRACTED = 2
            }

            /** VehicleInterfaceStateType enum. */
            enum VehicleInterfaceStateType {
                VEHICLE_INTERFACE_STATE_TYPE_UNSPECIFIED = 0,
                VEHICLE_INTERFACE_STATE_TYPE_DISARMED = 1,
                VEHICLE_INTERFACE_STATE_TYPE_FREE_FLOAT = 2,
                VEHICLE_INTERFACE_STATE_TYPE_ROUTE_FOLLOWING = 3,
                VEHICLE_INTERFACE_STATE_TYPE_CONTROLLED_DRIFT = 4,
                VEHICLE_INTERFACE_STATE_TYPE_VECTOR = 5,
                VEHICLE_INTERFACE_STATE_TYPE_FOLLOW_TARGET = 6,
                VEHICLE_INTERFACE_STATE_TYPE_REMOTELY_OPERATED = 7
            }

            /** TaskType enum. */
            enum TaskType {
                TASK_TYPE_UNSPECIFIED = 0,
                TASK_TYPE_ROUTE = 1,
                TASK_TYPE_SEARCH = 2,
                TASK_TYPE_ENGAGE = 3,
                TASK_TYPE_COOPERATIVE_FORMATION = 4,
                TASK_TYPE_GEO_FORMATION = 5,
                TASK_TYPE_ESCORT = 6,
                TASK_TYPE_CHECKOUT = 7,
                TASK_TYPE_PATROL = 8,
                TASK_TYPE_DRIFT = 9
            }

            /** EngagementMode enum. */
            enum EngagementMode {
                ENGAGEMENT_MODE_UNKNOWN = 0,
                ENGAGEMENT_MODE_INDEPENDENT = 1,
                ENGAGEMENT_MODE_COORDINATED = 2
            }

            /** Feature enum. */
            enum Feature {
                FEATURE_UNKNOWN = 0,
                FEATURE_VIDEO_STREAMING = 1
            }

            /** VehicleSizeClass enum. */
            enum VehicleSizeClass {
                VEHICLE_SIZE_CLASS_UNKNOWN = 0,
                VEHICLE_SIZE_CLASS_SMALL = 1,
                VEHICLE_SIZE_CLASS_MEDIUM = 2,
                VEHICLE_SIZE_CLASS_LARGE = 3
            }

            /** RotationDirection enum. */
            enum RotationDirection {
                ROTATION_DIRECTION_UNKNOWN = 0,
                ROTATION_DIRECTION_CLOCKWISE = 1,
                ROTATION_DIRECTION_COUNTERCLOCKWISE = 2
            }

            /** CDRState enum. */
            enum CDRState {
                CDR_STATE_UNKNOWN = 0,
                CDR_STATE_DISABLED = 1,
                CDR_STATE_INACTIVE = 2,
                CDR_STATE_ACTIVE = 3
            }

            /** Properties of a PlayData. */
            interface IPlayData {

                /** PlayData id */
                id?: (string|null);

                /** PlayData key */
                key?: (havocai.messages.v0.PlayKey|null);

                /** PlayData dataSource */
                dataSource?: (havocai.messages.v0.DataSource|null);

                /** PlayData geoFences */
                geoFences?: (havocai.messages.v0.IGeoFence[]|null);

                /** PlayData minBoats */
                minBoats?: (number|null);

                /** PlayData minCapacity */
                minCapacity?: (number|null);

                /** PlayData respectGeoFences */
                respectGeoFences?: (boolean|null);

                /** PlayData defaultParams */
                defaultParams?: (havocai.messages.v0.ITaskParams|null);

                /** PlayData taskParams */
                taskParams?: (havocai.messages.v0.ITaskParams[]|null);

                /** PlayData direct */
                direct?: (havocai.messages.v0.IDirectParams|null);

                /** PlayData contestedLogistics */
                contestedLogistics?: (havocai.messages.v0.IContestedLogisticsParams|null);

                /** PlayData payloadOrchestration */
                payloadOrchestration?: (havocai.messages.v0.IPayloadOrchestrationParams|null);

                /** PlayData findFixInvestigate */
                findFixInvestigate?: (havocai.messages.v0.IFindFixInvestigateParams|null);

                /** PlayData checkout */
                checkout?: (havocai.messages.v0.ICheckoutParams|null);

                /** PlayData beachLaunch */
                beachLaunch?: (havocai.messages.v0.IBeachLaunchParams|null);

                /** PlayData avast */
                avast?: (havocai.messages.v0.IAvastParams|null);

                /** PlayData jazz */
                jazz?: (havocai.messages.v0.IJazzParams|null);

                /** PlayData chariotRampControl */
                chariotRampControl?: (havocai.messages.v0.IChariotRampControlParams|null);

                /** PlayData chariotResupply */
                chariotResupply?: (havocai.messages.v0.IChariotResupplyParams|null);

                /** PlayData engageTrack */
                engageTrack?: (havocai.messages.v0.IEngageTrackParams|null);
            }

            /** Represents a PlayData. */
            class PlayData implements IPlayData {

                /**
                 * Constructs a new PlayData.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IPlayData);

                /** PlayData id. */
                public id: string;

                /** PlayData key. */
                public key: havocai.messages.v0.PlayKey;

                /** PlayData dataSource. */
                public dataSource: havocai.messages.v0.DataSource;

                /** PlayData geoFences. */
                public geoFences: havocai.messages.v0.IGeoFence[];

                /** PlayData minBoats. */
                public minBoats: number;

                /** PlayData minCapacity. */
                public minCapacity: number;

                /** PlayData respectGeoFences. */
                public respectGeoFences: boolean;

                /** PlayData defaultParams. */
                public defaultParams?: (havocai.messages.v0.ITaskParams|null);

                /** PlayData taskParams. */
                public taskParams: havocai.messages.v0.ITaskParams[];

                /** PlayData direct. */
                public direct?: (havocai.messages.v0.IDirectParams|null);

                /** PlayData contestedLogistics. */
                public contestedLogistics?: (havocai.messages.v0.IContestedLogisticsParams|null);

                /** PlayData payloadOrchestration. */
                public payloadOrchestration?: (havocai.messages.v0.IPayloadOrchestrationParams|null);

                /** PlayData findFixInvestigate. */
                public findFixInvestigate?: (havocai.messages.v0.IFindFixInvestigateParams|null);

                /** PlayData checkout. */
                public checkout?: (havocai.messages.v0.ICheckoutParams|null);

                /** PlayData beachLaunch. */
                public beachLaunch?: (havocai.messages.v0.IBeachLaunchParams|null);

                /** PlayData avast. */
                public avast?: (havocai.messages.v0.IAvastParams|null);

                /** PlayData jazz. */
                public jazz?: (havocai.messages.v0.IJazzParams|null);

                /** PlayData chariotRampControl. */
                public chariotRampControl?: (havocai.messages.v0.IChariotRampControlParams|null);

                /** PlayData chariotResupply. */
                public chariotResupply?: (havocai.messages.v0.IChariotResupplyParams|null);

                /** PlayData engageTrack. */
                public engageTrack?: (havocai.messages.v0.IEngageTrackParams|null);

                /** PlayData playParams. */
                public playParams?: ("direct"|"contestedLogistics"|"payloadOrchestration"|"findFixInvestigate"|"checkout"|"beachLaunch"|"avast"|"jazz"|"chariotRampControl"|"chariotResupply"|"engageTrack");

                /**
                 * Creates a new PlayData instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PlayData instance
                 */
                public static create(properties?: havocai.messages.v0.IPlayData): havocai.messages.v0.PlayData;

                /**
                 * Encodes the specified PlayData message. Does not implicitly {@link havocai.messages.v0.PlayData.verify|verify} messages.
                 * @param message PlayData message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IPlayData, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PlayData message, length delimited. Does not implicitly {@link havocai.messages.v0.PlayData.verify|verify} messages.
                 * @param message PlayData message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IPlayData, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PlayData message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PlayData
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.PlayData;

                /**
                 * Decodes a PlayData message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PlayData
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.PlayData;

                /**
                 * Verifies a PlayData message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PlayData message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PlayData
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.PlayData;

                /**
                 * Creates a plain object from a PlayData message. Also converts values to other types if specified.
                 * @param message PlayData
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.PlayData, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PlayData to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for PlayData
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a PlayStatus. */
            interface IPlayStatus {

                /** PlayStatus state */
                state?: (havocai.messages.v0.PlayState|null);

                /** PlayStatus requestTime */
                requestTime?: (number|Long|null);

                /** PlayStatus data */
                data?: (havocai.messages.v0.IPlayData|null);

                /** PlayStatus tasks */
                tasks?: (havocai.messages.v0.ITask[]|null);
            }

            /** Represents a PlayStatus. */
            class PlayStatus implements IPlayStatus {

                /**
                 * Constructs a new PlayStatus.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IPlayStatus);

                /** PlayStatus state. */
                public state: havocai.messages.v0.PlayState;

                /** PlayStatus requestTime. */
                public requestTime: (number|Long);

                /** PlayStatus data. */
                public data?: (havocai.messages.v0.IPlayData|null);

                /** PlayStatus tasks. */
                public tasks: havocai.messages.v0.ITask[];

                /**
                 * Creates a new PlayStatus instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PlayStatus instance
                 */
                public static create(properties?: havocai.messages.v0.IPlayStatus): havocai.messages.v0.PlayStatus;

                /**
                 * Encodes the specified PlayStatus message. Does not implicitly {@link havocai.messages.v0.PlayStatus.verify|verify} messages.
                 * @param message PlayStatus message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IPlayStatus, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PlayStatus message, length delimited. Does not implicitly {@link havocai.messages.v0.PlayStatus.verify|verify} messages.
                 * @param message PlayStatus message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IPlayStatus, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PlayStatus message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PlayStatus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.PlayStatus;

                /**
                 * Decodes a PlayStatus message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PlayStatus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.PlayStatus;

                /**
                 * Verifies a PlayStatus message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PlayStatus message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PlayStatus
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.PlayStatus;

                /**
                 * Creates a plain object from a PlayStatus message. Also converts values to other types if specified.
                 * @param message PlayStatus
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.PlayStatus, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PlayStatus to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for PlayStatus
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a DirectParams. */
            interface IDirectParams {

                /** DirectParams goalLocation */
                goalLocation?: (havocai.messages.v0.IGeoPoint|null);
            }

            /** Represents a DirectParams. */
            class DirectParams implements IDirectParams {

                /**
                 * Constructs a new DirectParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IDirectParams);

                /** DirectParams goalLocation. */
                public goalLocation?: (havocai.messages.v0.IGeoPoint|null);

                /**
                 * Creates a new DirectParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DirectParams instance
                 */
                public static create(properties?: havocai.messages.v0.IDirectParams): havocai.messages.v0.DirectParams;

                /**
                 * Encodes the specified DirectParams message. Does not implicitly {@link havocai.messages.v0.DirectParams.verify|verify} messages.
                 * @param message DirectParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IDirectParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DirectParams message, length delimited. Does not implicitly {@link havocai.messages.v0.DirectParams.verify|verify} messages.
                 * @param message DirectParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IDirectParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DirectParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DirectParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.DirectParams;

                /**
                 * Decodes a DirectParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DirectParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.DirectParams;

                /**
                 * Verifies a DirectParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DirectParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DirectParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.DirectParams;

                /**
                 * Creates a plain object from a DirectParams message. Also converts values to other types if specified.
                 * @param message DirectParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.DirectParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DirectParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for DirectParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a ContestedLogisticsParams. */
            interface IContestedLogisticsParams {

                /** ContestedLogisticsParams pickupZone */
                pickupZone?: (havocai.messages.v0.IResourceRef|null);

                /** ContestedLogisticsParams dropoffZone */
                dropoffZone?: (havocai.messages.v0.IResourceRef|null);
            }

            /** Represents a ContestedLogisticsParams. */
            class ContestedLogisticsParams implements IContestedLogisticsParams {

                /**
                 * Constructs a new ContestedLogisticsParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IContestedLogisticsParams);

                /** ContestedLogisticsParams pickupZone. */
                public pickupZone?: (havocai.messages.v0.IResourceRef|null);

                /** ContestedLogisticsParams dropoffZone. */
                public dropoffZone?: (havocai.messages.v0.IResourceRef|null);

                /**
                 * Creates a new ContestedLogisticsParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ContestedLogisticsParams instance
                 */
                public static create(properties?: havocai.messages.v0.IContestedLogisticsParams): havocai.messages.v0.ContestedLogisticsParams;

                /**
                 * Encodes the specified ContestedLogisticsParams message. Does not implicitly {@link havocai.messages.v0.ContestedLogisticsParams.verify|verify} messages.
                 * @param message ContestedLogisticsParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IContestedLogisticsParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ContestedLogisticsParams message, length delimited. Does not implicitly {@link havocai.messages.v0.ContestedLogisticsParams.verify|verify} messages.
                 * @param message ContestedLogisticsParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IContestedLogisticsParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ContestedLogisticsParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ContestedLogisticsParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.ContestedLogisticsParams;

                /**
                 * Decodes a ContestedLogisticsParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ContestedLogisticsParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.ContestedLogisticsParams;

                /**
                 * Verifies a ContestedLogisticsParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ContestedLogisticsParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ContestedLogisticsParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.ContestedLogisticsParams;

                /**
                 * Creates a plain object from a ContestedLogisticsParams message. Also converts values to other types if specified.
                 * @param message ContestedLogisticsParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.ContestedLogisticsParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ContestedLogisticsParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ContestedLogisticsParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a PayloadOrchestrationParams. */
            interface IPayloadOrchestrationParams {

                /** PayloadOrchestrationParams track */
                track?: (havocai.messages.v0.IResourceRef|null);

                /** PayloadOrchestrationParams formation */
                formation?: (havocai.messages.v0.ICooperativeOffset|null);
            }

            /** Represents a PayloadOrchestrationParams. */
            class PayloadOrchestrationParams implements IPayloadOrchestrationParams {

                /**
                 * Constructs a new PayloadOrchestrationParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IPayloadOrchestrationParams);

                /** PayloadOrchestrationParams track. */
                public track?: (havocai.messages.v0.IResourceRef|null);

                /** PayloadOrchestrationParams formation. */
                public formation?: (havocai.messages.v0.ICooperativeOffset|null);

                /**
                 * Creates a new PayloadOrchestrationParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PayloadOrchestrationParams instance
                 */
                public static create(properties?: havocai.messages.v0.IPayloadOrchestrationParams): havocai.messages.v0.PayloadOrchestrationParams;

                /**
                 * Encodes the specified PayloadOrchestrationParams message. Does not implicitly {@link havocai.messages.v0.PayloadOrchestrationParams.verify|verify} messages.
                 * @param message PayloadOrchestrationParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IPayloadOrchestrationParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PayloadOrchestrationParams message, length delimited. Does not implicitly {@link havocai.messages.v0.PayloadOrchestrationParams.verify|verify} messages.
                 * @param message PayloadOrchestrationParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IPayloadOrchestrationParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PayloadOrchestrationParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PayloadOrchestrationParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.PayloadOrchestrationParams;

                /**
                 * Decodes a PayloadOrchestrationParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PayloadOrchestrationParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.PayloadOrchestrationParams;

                /**
                 * Verifies a PayloadOrchestrationParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PayloadOrchestrationParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PayloadOrchestrationParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.PayloadOrchestrationParams;

                /**
                 * Creates a plain object from a PayloadOrchestrationParams message. Also converts values to other types if specified.
                 * @param message PayloadOrchestrationParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.PayloadOrchestrationParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PayloadOrchestrationParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for PayloadOrchestrationParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a FindFixInvestigateParams. */
            interface IFindFixInvestigateParams {

                /** FindFixInvestigateParams searchArea */
                searchArea?: (havocai.messages.v0.IGeoPoint[]|null);

                /** FindFixInvestigateParams track */
                track?: (havocai.messages.v0.IResourceRef|null);

                /** FindFixInvestigateParams searchStrategy */
                searchStrategy?: (havocai.messages.v0.SearchStrategy|null);

                /** FindFixInvestigateParams searchSensorRadius */
                searchSensorRadius?: (number|null);
            }

            /** Represents a FindFixInvestigateParams. */
            class FindFixInvestigateParams implements IFindFixInvestigateParams {

                /**
                 * Constructs a new FindFixInvestigateParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IFindFixInvestigateParams);

                /** FindFixInvestigateParams searchArea. */
                public searchArea: havocai.messages.v0.IGeoPoint[];

                /** FindFixInvestigateParams track. */
                public track?: (havocai.messages.v0.IResourceRef|null);

                /** FindFixInvestigateParams searchStrategy. */
                public searchStrategy: havocai.messages.v0.SearchStrategy;

                /** FindFixInvestigateParams searchSensorRadius. */
                public searchSensorRadius: number;

                /**
                 * Creates a new FindFixInvestigateParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns FindFixInvestigateParams instance
                 */
                public static create(properties?: havocai.messages.v0.IFindFixInvestigateParams): havocai.messages.v0.FindFixInvestigateParams;

                /**
                 * Encodes the specified FindFixInvestigateParams message. Does not implicitly {@link havocai.messages.v0.FindFixInvestigateParams.verify|verify} messages.
                 * @param message FindFixInvestigateParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IFindFixInvestigateParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified FindFixInvestigateParams message, length delimited. Does not implicitly {@link havocai.messages.v0.FindFixInvestigateParams.verify|verify} messages.
                 * @param message FindFixInvestigateParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IFindFixInvestigateParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a FindFixInvestigateParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns FindFixInvestigateParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.FindFixInvestigateParams;

                /**
                 * Decodes a FindFixInvestigateParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns FindFixInvestigateParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.FindFixInvestigateParams;

                /**
                 * Verifies a FindFixInvestigateParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a FindFixInvestigateParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns FindFixInvestigateParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.FindFixInvestigateParams;

                /**
                 * Creates a plain object from a FindFixInvestigateParams message. Also converts values to other types if specified.
                 * @param message FindFixInvestigateParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.FindFixInvestigateParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this FindFixInvestigateParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for FindFixInvestigateParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a CheckoutParams. */
            interface ICheckoutParams {
            }

            /** Represents a CheckoutParams. */
            class CheckoutParams implements ICheckoutParams {

                /**
                 * Constructs a new CheckoutParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ICheckoutParams);

                /**
                 * Creates a new CheckoutParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns CheckoutParams instance
                 */
                public static create(properties?: havocai.messages.v0.ICheckoutParams): havocai.messages.v0.CheckoutParams;

                /**
                 * Encodes the specified CheckoutParams message. Does not implicitly {@link havocai.messages.v0.CheckoutParams.verify|verify} messages.
                 * @param message CheckoutParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ICheckoutParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified CheckoutParams message, length delimited. Does not implicitly {@link havocai.messages.v0.CheckoutParams.verify|verify} messages.
                 * @param message CheckoutParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ICheckoutParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a CheckoutParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns CheckoutParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.CheckoutParams;

                /**
                 * Decodes a CheckoutParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns CheckoutParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.CheckoutParams;

                /**
                 * Verifies a CheckoutParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a CheckoutParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns CheckoutParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.CheckoutParams;

                /**
                 * Creates a plain object from a CheckoutParams message. Also converts values to other types if specified.
                 * @param message CheckoutParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.CheckoutParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this CheckoutParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for CheckoutParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a BeachLaunchParams. */
            interface IBeachLaunchParams {

                /** BeachLaunchParams launchZone */
                launchZone?: (havocai.messages.v0.IResourceRef|null);
            }

            /** Represents a BeachLaunchParams. */
            class BeachLaunchParams implements IBeachLaunchParams {

                /**
                 * Constructs a new BeachLaunchParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IBeachLaunchParams);

                /** BeachLaunchParams launchZone. */
                public launchZone?: (havocai.messages.v0.IResourceRef|null);

                /**
                 * Creates a new BeachLaunchParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns BeachLaunchParams instance
                 */
                public static create(properties?: havocai.messages.v0.IBeachLaunchParams): havocai.messages.v0.BeachLaunchParams;

                /**
                 * Encodes the specified BeachLaunchParams message. Does not implicitly {@link havocai.messages.v0.BeachLaunchParams.verify|verify} messages.
                 * @param message BeachLaunchParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IBeachLaunchParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified BeachLaunchParams message, length delimited. Does not implicitly {@link havocai.messages.v0.BeachLaunchParams.verify|verify} messages.
                 * @param message BeachLaunchParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IBeachLaunchParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a BeachLaunchParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns BeachLaunchParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.BeachLaunchParams;

                /**
                 * Decodes a BeachLaunchParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns BeachLaunchParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.BeachLaunchParams;

                /**
                 * Verifies a BeachLaunchParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a BeachLaunchParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns BeachLaunchParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.BeachLaunchParams;

                /**
                 * Creates a plain object from a BeachLaunchParams message. Also converts values to other types if specified.
                 * @param message BeachLaunchParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.BeachLaunchParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this BeachLaunchParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for BeachLaunchParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an AvastParams. */
            interface IAvastParams {
            }

            /** Represents an AvastParams. */
            class AvastParams implements IAvastParams {

                /**
                 * Constructs a new AvastParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IAvastParams);

                /**
                 * Creates a new AvastParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns AvastParams instance
                 */
                public static create(properties?: havocai.messages.v0.IAvastParams): havocai.messages.v0.AvastParams;

                /**
                 * Encodes the specified AvastParams message. Does not implicitly {@link havocai.messages.v0.AvastParams.verify|verify} messages.
                 * @param message AvastParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IAvastParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified AvastParams message, length delimited. Does not implicitly {@link havocai.messages.v0.AvastParams.verify|verify} messages.
                 * @param message AvastParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IAvastParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an AvastParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns AvastParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.AvastParams;

                /**
                 * Decodes an AvastParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns AvastParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.AvastParams;

                /**
                 * Verifies an AvastParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an AvastParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns AvastParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.AvastParams;

                /**
                 * Creates a plain object from an AvastParams message. Also converts values to other types if specified.
                 * @param message AvastParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.AvastParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this AvastParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for AvastParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a JazzParams. */
            interface IJazzParams {

                /** JazzParams value */
                value?: (string|null);
            }

            /** Represents a JazzParams. */
            class JazzParams implements IJazzParams {

                /**
                 * Constructs a new JazzParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IJazzParams);

                /** JazzParams value. */
                public value: string;

                /**
                 * Creates a new JazzParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns JazzParams instance
                 */
                public static create(properties?: havocai.messages.v0.IJazzParams): havocai.messages.v0.JazzParams;

                /**
                 * Encodes the specified JazzParams message. Does not implicitly {@link havocai.messages.v0.JazzParams.verify|verify} messages.
                 * @param message JazzParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IJazzParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified JazzParams message, length delimited. Does not implicitly {@link havocai.messages.v0.JazzParams.verify|verify} messages.
                 * @param message JazzParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IJazzParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a JazzParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns JazzParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.JazzParams;

                /**
                 * Decodes a JazzParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns JazzParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.JazzParams;

                /**
                 * Verifies a JazzParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a JazzParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns JazzParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.JazzParams;

                /**
                 * Creates a plain object from a JazzParams message. Also converts values to other types if specified.
                 * @param message JazzParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.JazzParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this JazzParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for JazzParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a ChariotRampControlParams. */
            interface IChariotRampControlParams {

                /** ChariotRampControlParams rampPosition */
                rampPosition?: (havocai.messages.v0.ActuatorPositionGoal|null);
            }

            /** Represents a ChariotRampControlParams. */
            class ChariotRampControlParams implements IChariotRampControlParams {

                /**
                 * Constructs a new ChariotRampControlParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IChariotRampControlParams);

                /** ChariotRampControlParams rampPosition. */
                public rampPosition: havocai.messages.v0.ActuatorPositionGoal;

                /**
                 * Creates a new ChariotRampControlParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ChariotRampControlParams instance
                 */
                public static create(properties?: havocai.messages.v0.IChariotRampControlParams): havocai.messages.v0.ChariotRampControlParams;

                /**
                 * Encodes the specified ChariotRampControlParams message. Does not implicitly {@link havocai.messages.v0.ChariotRampControlParams.verify|verify} messages.
                 * @param message ChariotRampControlParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IChariotRampControlParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ChariotRampControlParams message, length delimited. Does not implicitly {@link havocai.messages.v0.ChariotRampControlParams.verify|verify} messages.
                 * @param message ChariotRampControlParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IChariotRampControlParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ChariotRampControlParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ChariotRampControlParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.ChariotRampControlParams;

                /**
                 * Decodes a ChariotRampControlParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ChariotRampControlParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.ChariotRampControlParams;

                /**
                 * Verifies a ChariotRampControlParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ChariotRampControlParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ChariotRampControlParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.ChariotRampControlParams;

                /**
                 * Creates a plain object from a ChariotRampControlParams message. Also converts values to other types if specified.
                 * @param message ChariotRampControlParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.ChariotRampControlParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ChariotRampControlParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ChariotRampControlParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a ChariotResupplyParams. */
            interface IChariotResupplyParams {

                /** ChariotResupplyParams resupplyZone */
                resupplyZone?: (havocai.messages.v0.IResourceRef|null);

                /** ChariotResupplyParams shoreHeading */
                shoreHeading?: (number|null);
            }

            /** Represents a ChariotResupplyParams. */
            class ChariotResupplyParams implements IChariotResupplyParams {

                /**
                 * Constructs a new ChariotResupplyParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IChariotResupplyParams);

                /** ChariotResupplyParams resupplyZone. */
                public resupplyZone?: (havocai.messages.v0.IResourceRef|null);

                /** ChariotResupplyParams shoreHeading. */
                public shoreHeading: number;

                /**
                 * Creates a new ChariotResupplyParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ChariotResupplyParams instance
                 */
                public static create(properties?: havocai.messages.v0.IChariotResupplyParams): havocai.messages.v0.ChariotResupplyParams;

                /**
                 * Encodes the specified ChariotResupplyParams message. Does not implicitly {@link havocai.messages.v0.ChariotResupplyParams.verify|verify} messages.
                 * @param message ChariotResupplyParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IChariotResupplyParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ChariotResupplyParams message, length delimited. Does not implicitly {@link havocai.messages.v0.ChariotResupplyParams.verify|verify} messages.
                 * @param message ChariotResupplyParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IChariotResupplyParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ChariotResupplyParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ChariotResupplyParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.ChariotResupplyParams;

                /**
                 * Decodes a ChariotResupplyParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ChariotResupplyParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.ChariotResupplyParams;

                /**
                 * Verifies a ChariotResupplyParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ChariotResupplyParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ChariotResupplyParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.ChariotResupplyParams;

                /**
                 * Creates a plain object from a ChariotResupplyParams message. Also converts values to other types if specified.
                 * @param message ChariotResupplyParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.ChariotResupplyParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ChariotResupplyParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ChariotResupplyParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an EngageTrackParams. */
            interface IEngageTrackParams {

                /** EngageTrackParams track */
                track?: (havocai.messages.v0.IResourceRef|null);

                /** EngageTrackParams standoffRange */
                standoffRange?: (number|null);
            }

            /** Represents an EngageTrackParams. */
            class EngageTrackParams implements IEngageTrackParams {

                /**
                 * Constructs a new EngageTrackParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IEngageTrackParams);

                /** EngageTrackParams track. */
                public track?: (havocai.messages.v0.IResourceRef|null);

                /** EngageTrackParams standoffRange. */
                public standoffRange: number;

                /**
                 * Creates a new EngageTrackParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns EngageTrackParams instance
                 */
                public static create(properties?: havocai.messages.v0.IEngageTrackParams): havocai.messages.v0.EngageTrackParams;

                /**
                 * Encodes the specified EngageTrackParams message. Does not implicitly {@link havocai.messages.v0.EngageTrackParams.verify|verify} messages.
                 * @param message EngageTrackParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IEngageTrackParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified EngageTrackParams message, length delimited. Does not implicitly {@link havocai.messages.v0.EngageTrackParams.verify|verify} messages.
                 * @param message EngageTrackParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IEngageTrackParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an EngageTrackParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns EngageTrackParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.EngageTrackParams;

                /**
                 * Decodes an EngageTrackParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns EngageTrackParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.EngageTrackParams;

                /**
                 * Verifies an EngageTrackParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an EngageTrackParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns EngageTrackParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.EngageTrackParams;

                /**
                 * Creates a plain object from an EngageTrackParams message. Also converts values to other types if specified.
                 * @param message EngageTrackParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.EngageTrackParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this EngageTrackParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for EngageTrackParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Metadata. */
            interface IMetadata {

                /** Metadata kind */
                kind?: (havocai.messages.v0.ResourceKind|null);

                /** Metadata id */
                id?: (string|null);

                /** Metadata name */
                name?: (string|null);

                /** Metadata description */
                description?: (string|null);

                /** Metadata creationTime */
                creationTime?: (number|Long|null);

                /** Metadata modificationTime */
                modificationTime?: (number|Long|null);

                /** Metadata dataSource */
                dataSource?: (havocai.messages.v0.DataSource|null);

                /** Metadata labels */
                labels?: ({ [k: string]: string }|null);

                /** Metadata tags */
                tags?: (string[]|null);
            }

            /** Represents a Metadata. */
            class Metadata implements IMetadata {

                /**
                 * Constructs a new Metadata.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IMetadata);

                /** Metadata kind. */
                public kind: havocai.messages.v0.ResourceKind;

                /** Metadata id. */
                public id: string;

                /** Metadata name. */
                public name: string;

                /** Metadata description. */
                public description: string;

                /** Metadata creationTime. */
                public creationTime: (number|Long);

                /** Metadata modificationTime. */
                public modificationTime: (number|Long);

                /** Metadata dataSource. */
                public dataSource: havocai.messages.v0.DataSource;

                /** Metadata labels. */
                public labels: { [k: string]: string };

                /** Metadata tags. */
                public tags: string[];

                /**
                 * Creates a new Metadata instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Metadata instance
                 */
                public static create(properties?: havocai.messages.v0.IMetadata): havocai.messages.v0.Metadata;

                /**
                 * Encodes the specified Metadata message. Does not implicitly {@link havocai.messages.v0.Metadata.verify|verify} messages.
                 * @param message Metadata message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Metadata message, length delimited. Does not implicitly {@link havocai.messages.v0.Metadata.verify|verify} messages.
                 * @param message Metadata message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Metadata message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Metadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Metadata;

                /**
                 * Decodes a Metadata message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Metadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Metadata;

                /**
                 * Verifies a Metadata message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Metadata message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Metadata
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Metadata;

                /**
                 * Creates a plain object from a Metadata message. Also converts values to other types if specified.
                 * @param message Metadata
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Metadata, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Metadata to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Metadata
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a ResourceRef. */
            interface IResourceRef {

                /** ResourceRef kind */
                kind?: (havocai.messages.v0.ResourceKind|null);

                /** ResourceRef id */
                id?: (string|null);

                /** ResourceRef name */
                name?: (string|null);
            }

            /** Represents a ResourceRef. */
            class ResourceRef implements IResourceRef {

                /**
                 * Constructs a new ResourceRef.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IResourceRef);

                /** ResourceRef kind. */
                public kind: havocai.messages.v0.ResourceKind;

                /** ResourceRef id. */
                public id: string;

                /** ResourceRef name. */
                public name: string;

                /**
                 * Creates a new ResourceRef instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ResourceRef instance
                 */
                public static create(properties?: havocai.messages.v0.IResourceRef): havocai.messages.v0.ResourceRef;

                /**
                 * Encodes the specified ResourceRef message. Does not implicitly {@link havocai.messages.v0.ResourceRef.verify|verify} messages.
                 * @param message ResourceRef message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IResourceRef, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ResourceRef message, length delimited. Does not implicitly {@link havocai.messages.v0.ResourceRef.verify|verify} messages.
                 * @param message ResourceRef message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IResourceRef, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ResourceRef message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ResourceRef
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.ResourceRef;

                /**
                 * Decodes a ResourceRef message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ResourceRef
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.ResourceRef;

                /**
                 * Verifies a ResourceRef message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ResourceRef message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ResourceRef
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.ResourceRef;

                /**
                 * Creates a plain object from a ResourceRef message. Also converts values to other types if specified.
                 * @param message ResourceRef
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.ResourceRef, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ResourceRef to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ResourceRef
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Component. */
            interface IComponent {

                /** Component key */
                key?: (havocai.messages.v0.ComponentKey|null);

                /** Component health */
                health?: (havocai.messages.v0.Health|null);

                /** Component errors */
                errors?: (havocai.messages.v0.IError[]|null);
            }

            /** Represents a Component. */
            class Component implements IComponent {

                /**
                 * Constructs a new Component.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IComponent);

                /** Component key. */
                public key: havocai.messages.v0.ComponentKey;

                /** Component health. */
                public health: havocai.messages.v0.Health;

                /** Component errors. */
                public errors: havocai.messages.v0.IError[];

                /**
                 * Creates a new Component instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Component instance
                 */
                public static create(properties?: havocai.messages.v0.IComponent): havocai.messages.v0.Component;

                /**
                 * Encodes the specified Component message. Does not implicitly {@link havocai.messages.v0.Component.verify|verify} messages.
                 * @param message Component message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IComponent, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Component message, length delimited. Does not implicitly {@link havocai.messages.v0.Component.verify|verify} messages.
                 * @param message Component message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IComponent, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Component message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Component
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Component;

                /**
                 * Decodes a Component message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Component
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Component;

                /**
                 * Verifies a Component message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Component message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Component
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Component;

                /**
                 * Creates a plain object from a Component message. Also converts values to other types if specified.
                 * @param message Component
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Component, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Component to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Component
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Task. */
            interface ITask {

                /** Task playKey */
                playKey?: (havocai.messages.v0.PlayKey|null);

                /** Task key */
                key?: (havocai.messages.v0.TaskKey|null);

                /** Task boatCount */
                boatCount?: (number|null);

                /** Task eta */
                eta?: (number|Long|null);

                /** Task lastEta */
                lastEta?: (number|Long|null);

                /** Task goalLocation */
                goalLocation?: (havocai.messages.v0.IGeoPoint|null);

                /** Task goalTrack */
                goalTrack?: (havocai.messages.v0.IResourceRef|null);

                /** Task goalZone */
                goalZone?: (havocai.messages.v0.IResourceRef|null);

                /** Task goalWaypointType */
                goalWaypointType?: (havocai.messages.v0.WaypointType|null);

                /** Task supportedCommands */
                supportedCommands?: (havocai.messages.v0.Command[]|null);
            }

            /** Represents a Task. */
            class Task implements ITask {

                /**
                 * Constructs a new Task.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ITask);

                /** Task playKey. */
                public playKey: havocai.messages.v0.PlayKey;

                /** Task key. */
                public key: havocai.messages.v0.TaskKey;

                /** Task boatCount. */
                public boatCount: number;

                /** Task eta. */
                public eta: (number|Long);

                /** Task lastEta. */
                public lastEta: (number|Long);

                /** Task goalLocation. */
                public goalLocation?: (havocai.messages.v0.IGeoPoint|null);

                /** Task goalTrack. */
                public goalTrack?: (havocai.messages.v0.IResourceRef|null);

                /** Task goalZone. */
                public goalZone?: (havocai.messages.v0.IResourceRef|null);

                /** Task goalWaypointType. */
                public goalWaypointType: havocai.messages.v0.WaypointType;

                /** Task supportedCommands. */
                public supportedCommands: havocai.messages.v0.Command[];

                /**
                 * Creates a new Task instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Task instance
                 */
                public static create(properties?: havocai.messages.v0.ITask): havocai.messages.v0.Task;

                /**
                 * Encodes the specified Task message. Does not implicitly {@link havocai.messages.v0.Task.verify|verify} messages.
                 * @param message Task message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ITask, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Task message, length delimited. Does not implicitly {@link havocai.messages.v0.Task.verify|verify} messages.
                 * @param message Task message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ITask, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Task message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Task
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Task;

                /**
                 * Decodes a Task message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Task
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Task;

                /**
                 * Verifies a Task message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Task message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Task
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Task;

                /**
                 * Creates a plain object from a Task message. Also converts values to other types if specified.
                 * @param message Task
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Task, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Task to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Task
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TaskParams. */
            interface ITaskParams {

                /** TaskParams key */
                key?: (havocai.messages.v0.TaskKey|null);

                /** TaskParams targetSpeed */
                targetSpeed?: (number|null);

                /** TaskParams goalDistanceTolerance */
                goalDistanceTolerance?: (number|null);
            }

            /** Represents a TaskParams. */
            class TaskParams implements ITaskParams {

                /**
                 * Constructs a new TaskParams.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ITaskParams);

                /** TaskParams key. */
                public key: havocai.messages.v0.TaskKey;

                /** TaskParams targetSpeed. */
                public targetSpeed: number;

                /** TaskParams goalDistanceTolerance. */
                public goalDistanceTolerance: number;

                /**
                 * Creates a new TaskParams instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TaskParams instance
                 */
                public static create(properties?: havocai.messages.v0.ITaskParams): havocai.messages.v0.TaskParams;

                /**
                 * Encodes the specified TaskParams message. Does not implicitly {@link havocai.messages.v0.TaskParams.verify|verify} messages.
                 * @param message TaskParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ITaskParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TaskParams message, length delimited. Does not implicitly {@link havocai.messages.v0.TaskParams.verify|verify} messages.
                 * @param message TaskParams message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ITaskParams, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TaskParams message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TaskParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.TaskParams;

                /**
                 * Decodes a TaskParams message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TaskParams
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.TaskParams;

                /**
                 * Verifies a TaskParams message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TaskParams message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TaskParams
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.TaskParams;

                /**
                 * Creates a plain object from a TaskParams message. Also converts values to other types if specified.
                 * @param message TaskParams
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.TaskParams, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TaskParams to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TaskParams
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Subscription. */
            interface ISubscription {

                /** Subscription encoding */
                encoding?: (havocai.messages.v0.Encoding|null);

                /** Subscription updateInterval */
                updateInterval?: (number|null);

                /** Subscription criteria */
                criteria?: (havocai.messages.v0.ISubscriptionCriteria[]|null);
            }

            /** Represents a Subscription. */
            class Subscription implements ISubscription {

                /**
                 * Constructs a new Subscription.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ISubscription);

                /** Subscription encoding. */
                public encoding: havocai.messages.v0.Encoding;

                /** Subscription updateInterval. */
                public updateInterval: number;

                /** Subscription criteria. */
                public criteria: havocai.messages.v0.ISubscriptionCriteria[];

                /**
                 * Creates a new Subscription instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Subscription instance
                 */
                public static create(properties?: havocai.messages.v0.ISubscription): havocai.messages.v0.Subscription;

                /**
                 * Encodes the specified Subscription message. Does not implicitly {@link havocai.messages.v0.Subscription.verify|verify} messages.
                 * @param message Subscription message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ISubscription, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Subscription message, length delimited. Does not implicitly {@link havocai.messages.v0.Subscription.verify|verify} messages.
                 * @param message Subscription message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ISubscription, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Subscription message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Subscription
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Subscription;

                /**
                 * Decodes a Subscription message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Subscription
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Subscription;

                /**
                 * Verifies a Subscription message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Subscription message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Subscription
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Subscription;

                /**
                 * Creates a plain object from a Subscription message. Also converts values to other types if specified.
                 * @param message Subscription
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Subscription, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Subscription to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Subscription
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a SubscriptionCriteria. */
            interface ISubscriptionCriteria {

                /** SubscriptionCriteria resourceKind */
                resourceKind?: (havocai.messages.v0.ResourceKind|null);

                /** SubscriptionCriteria area */
                area?: (havocai.messages.v0.IGeoPoint[]|null);

                /** SubscriptionCriteria names */
                names?: (string[]|null);

                /** SubscriptionCriteria sectors */
                sectors?: (string[]|null);

                /** SubscriptionCriteria plays */
                plays?: (havocai.messages.v0.PlayKey[]|null);

                /** SubscriptionCriteria teams */
                teams?: (string[]|null);

                /** SubscriptionCriteria tasks */
                tasks?: (havocai.messages.v0.TaskKey[]|null);

                /** SubscriptionCriteria zoneTypes */
                zoneTypes?: (havocai.messages.v0.ZoneType[]|null);

                /** SubscriptionCriteria waypointTypes */
                waypointTypes?: (havocai.messages.v0.WaypointType[]|null);

                /** SubscriptionCriteria trackTypes */
                trackTypes?: (havocai.messages.v0.TrackType[]|null);

                /** SubscriptionCriteria affiliations */
                affiliations?: (havocai.messages.v0.Affiliation[]|null);

                /** SubscriptionCriteria tags */
                tags?: (string[]|null);
            }

            /** Represents a SubscriptionCriteria. */
            class SubscriptionCriteria implements ISubscriptionCriteria {

                /**
                 * Constructs a new SubscriptionCriteria.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ISubscriptionCriteria);

                /** SubscriptionCriteria resourceKind. */
                public resourceKind: havocai.messages.v0.ResourceKind;

                /** SubscriptionCriteria area. */
                public area: havocai.messages.v0.IGeoPoint[];

                /** SubscriptionCriteria names. */
                public names: string[];

                /** SubscriptionCriteria sectors. */
                public sectors: string[];

                /** SubscriptionCriteria plays. */
                public plays: havocai.messages.v0.PlayKey[];

                /** SubscriptionCriteria teams. */
                public teams: string[];

                /** SubscriptionCriteria tasks. */
                public tasks: havocai.messages.v0.TaskKey[];

                /** SubscriptionCriteria zoneTypes. */
                public zoneTypes: havocai.messages.v0.ZoneType[];

                /** SubscriptionCriteria waypointTypes. */
                public waypointTypes: havocai.messages.v0.WaypointType[];

                /** SubscriptionCriteria trackTypes. */
                public trackTypes: havocai.messages.v0.TrackType[];

                /** SubscriptionCriteria affiliations. */
                public affiliations: havocai.messages.v0.Affiliation[];

                /** SubscriptionCriteria tags. */
                public tags: string[];

                /**
                 * Creates a new SubscriptionCriteria instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SubscriptionCriteria instance
                 */
                public static create(properties?: havocai.messages.v0.ISubscriptionCriteria): havocai.messages.v0.SubscriptionCriteria;

                /**
                 * Encodes the specified SubscriptionCriteria message. Does not implicitly {@link havocai.messages.v0.SubscriptionCriteria.verify|verify} messages.
                 * @param message SubscriptionCriteria message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ISubscriptionCriteria, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SubscriptionCriteria message, length delimited. Does not implicitly {@link havocai.messages.v0.SubscriptionCriteria.verify|verify} messages.
                 * @param message SubscriptionCriteria message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ISubscriptionCriteria, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SubscriptionCriteria message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SubscriptionCriteria
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.SubscriptionCriteria;

                /**
                 * Decodes a SubscriptionCriteria message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SubscriptionCriteria
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.SubscriptionCriteria;

                /**
                 * Verifies a SubscriptionCriteria message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SubscriptionCriteria message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SubscriptionCriteria
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.SubscriptionCriteria;

                /**
                 * Creates a plain object from a SubscriptionCriteria message. Also converts values to other types if specified.
                 * @param message SubscriptionCriteria
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.SubscriptionCriteria, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SubscriptionCriteria to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for SubscriptionCriteria
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a CooperativeOffset. */
            interface ICooperativeOffset {

                /** CooperativeOffset config */
                config?: (havocai.messages.v0.CooperativeConfig|null);

                /** CooperativeOffset distance_0 */
                distance_0?: (number|null);

                /** CooperativeOffset distance_1 */
                distance_1?: (number|null);

                /** CooperativeOffset distance_2 */
                distance_2?: (number|null);

                /** CooperativeOffset angleA */
                angleA?: (number|null);

                /** CooperativeOffset angleB */
                angleB?: (number|null);

                /** CooperativeOffset location_0 */
                location_0?: (havocai.messages.v0.IGeoPoint|null);

                /** CooperativeOffset location_1 */
                location_1?: (havocai.messages.v0.IGeoPoint|null);
            }

            /** Represents a CooperativeOffset. */
            class CooperativeOffset implements ICooperativeOffset {

                /**
                 * Constructs a new CooperativeOffset.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ICooperativeOffset);

                /** CooperativeOffset config. */
                public config: havocai.messages.v0.CooperativeConfig;

                /** CooperativeOffset distance_0. */
                public distance_0: number;

                /** CooperativeOffset distance_1. */
                public distance_1: number;

                /** CooperativeOffset distance_2. */
                public distance_2: number;

                /** CooperativeOffset angleA. */
                public angleA: number;

                /** CooperativeOffset angleB. */
                public angleB: number;

                /** CooperativeOffset location_0. */
                public location_0?: (havocai.messages.v0.IGeoPoint|null);

                /** CooperativeOffset location_1. */
                public location_1?: (havocai.messages.v0.IGeoPoint|null);

                /**
                 * Creates a new CooperativeOffset instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns CooperativeOffset instance
                 */
                public static create(properties?: havocai.messages.v0.ICooperativeOffset): havocai.messages.v0.CooperativeOffset;

                /**
                 * Encodes the specified CooperativeOffset message. Does not implicitly {@link havocai.messages.v0.CooperativeOffset.verify|verify} messages.
                 * @param message CooperativeOffset message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ICooperativeOffset, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified CooperativeOffset message, length delimited. Does not implicitly {@link havocai.messages.v0.CooperativeOffset.verify|verify} messages.
                 * @param message CooperativeOffset message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ICooperativeOffset, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a CooperativeOffset message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns CooperativeOffset
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.CooperativeOffset;

                /**
                 * Decodes a CooperativeOffset message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns CooperativeOffset
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.CooperativeOffset;

                /**
                 * Verifies a CooperativeOffset message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a CooperativeOffset message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns CooperativeOffset
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.CooperativeOffset;

                /**
                 * Creates a plain object from a CooperativeOffset message. Also converts values to other types if specified.
                 * @param message CooperativeOffset
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.CooperativeOffset, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this CooperativeOffset to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for CooperativeOffset
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Waypoint. */
            interface IWaypoint {

                /** Waypoint name */
                name?: (string|null);

                /** Waypoint type */
                type?: (havocai.messages.v0.WaypointType|null);

                /** Waypoint location */
                location?: (havocai.messages.v0.IGeoPoint|null);
            }

            /** Represents a Waypoint. */
            class Waypoint implements IWaypoint {

                /**
                 * Constructs a new Waypoint.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IWaypoint);

                /** Waypoint name. */
                public name: string;

                /** Waypoint type. */
                public type: havocai.messages.v0.WaypointType;

                /** Waypoint location. */
                public location?: (havocai.messages.v0.IGeoPoint|null);

                /**
                 * Creates a new Waypoint instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Waypoint instance
                 */
                public static create(properties?: havocai.messages.v0.IWaypoint): havocai.messages.v0.Waypoint;

                /**
                 * Encodes the specified Waypoint message. Does not implicitly {@link havocai.messages.v0.Waypoint.verify|verify} messages.
                 * @param message Waypoint message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IWaypoint, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Waypoint message, length delimited. Does not implicitly {@link havocai.messages.v0.Waypoint.verify|verify} messages.
                 * @param message Waypoint message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IWaypoint, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Waypoint message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Waypoint
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Waypoint;

                /**
                 * Decodes a Waypoint message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Waypoint
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Waypoint;

                /**
                 * Verifies a Waypoint message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Waypoint message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Waypoint
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Waypoint;

                /**
                 * Creates a plain object from a Waypoint message. Also converts values to other types if specified.
                 * @param message Waypoint
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Waypoint, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Waypoint to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Waypoint
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Marker. */
            interface IMarker {

                /** Marker name */
                name?: (string|null);

                /** Marker type */
                type?: (havocai.messages.v0.MarkerType|null);

                /** Marker variant */
                variant?: (string|null);

                /** Marker location */
                location?: (havocai.messages.v0.IGeoPoint|null);

                /** Marker description */
                description?: (string|null);

                /** Marker icon */
                icon?: (string|null);

                /** Marker id */
                id?: (string|null);

                /** Marker dataSource */
                dataSource?: (havocai.messages.v0.DataSource|null);
            }

            /** Represents a Marker. */
            class Marker implements IMarker {

                /**
                 * Constructs a new Marker.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IMarker);

                /** Marker name. */
                public name: string;

                /** Marker type. */
                public type: havocai.messages.v0.MarkerType;

                /** Marker variant. */
                public variant: string;

                /** Marker location. */
                public location?: (havocai.messages.v0.IGeoPoint|null);

                /** Marker description. */
                public description: string;

                /** Marker icon. */
                public icon: string;

                /** Marker id. */
                public id: string;

                /** Marker dataSource. */
                public dataSource: havocai.messages.v0.DataSource;

                /**
                 * Creates a new Marker instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Marker instance
                 */
                public static create(properties?: havocai.messages.v0.IMarker): havocai.messages.v0.Marker;

                /**
                 * Encodes the specified Marker message. Does not implicitly {@link havocai.messages.v0.Marker.verify|verify} messages.
                 * @param message Marker message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IMarker, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Marker message, length delimited. Does not implicitly {@link havocai.messages.v0.Marker.verify|verify} messages.
                 * @param message Marker message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IMarker, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Marker message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Marker
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Marker;

                /**
                 * Decodes a Marker message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Marker
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Marker;

                /**
                 * Verifies a Marker message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Marker message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Marker
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Marker;

                /**
                 * Creates a plain object from a Marker message. Also converts values to other types if specified.
                 * @param message Marker
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Marker, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Marker to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Marker
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a GeoFence. */
            interface IGeoFence {

                /** GeoFence name */
                name?: (string|null);

                /** GeoFence type */
                type?: (havocai.messages.v0.GeoFenceType|null);

                /** GeoFence id */
                id?: (string|null);

                /** GeoFence dataSource */
                dataSource?: (havocai.messages.v0.DataSource|null);

                /** GeoFence area */
                area?: (havocai.messages.v0.IGeoPoint[]|null);
            }

            /** Represents a GeoFence. */
            class GeoFence implements IGeoFence {

                /**
                 * Constructs a new GeoFence.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IGeoFence);

                /** GeoFence name. */
                public name: string;

                /** GeoFence type. */
                public type: havocai.messages.v0.GeoFenceType;

                /** GeoFence id. */
                public id: string;

                /** GeoFence dataSource. */
                public dataSource: havocai.messages.v0.DataSource;

                /** GeoFence area. */
                public area: havocai.messages.v0.IGeoPoint[];

                /**
                 * Creates a new GeoFence instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns GeoFence instance
                 */
                public static create(properties?: havocai.messages.v0.IGeoFence): havocai.messages.v0.GeoFence;

                /**
                 * Encodes the specified GeoFence message. Does not implicitly {@link havocai.messages.v0.GeoFence.verify|verify} messages.
                 * @param message GeoFence message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IGeoFence, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified GeoFence message, length delimited. Does not implicitly {@link havocai.messages.v0.GeoFence.verify|verify} messages.
                 * @param message GeoFence message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IGeoFence, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a GeoFence message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns GeoFence
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.GeoFence;

                /**
                 * Decodes a GeoFence message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns GeoFence
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.GeoFence;

                /**
                 * Verifies a GeoFence message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a GeoFence message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns GeoFence
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.GeoFence;

                /**
                 * Creates a plain object from a GeoFence message. Also converts values to other types if specified.
                 * @param message GeoFence
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.GeoFence, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this GeoFence to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for GeoFence
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a GeoPose. */
            interface IGeoPose {

                /** GeoPose time */
                time?: (number|Long|null);

                /** GeoPose location */
                location?: (havocai.messages.v0.IGeoPoint|null);

                /** GeoPose orientation */
                orientation?: (havocai.messages.v0.IQuaternion|null);
            }

            /** Represents a GeoPose. */
            class GeoPose implements IGeoPose {

                /**
                 * Constructs a new GeoPose.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IGeoPose);

                /** GeoPose time. */
                public time: (number|Long);

                /** GeoPose location. */
                public location?: (havocai.messages.v0.IGeoPoint|null);

                /** GeoPose orientation. */
                public orientation?: (havocai.messages.v0.IQuaternion|null);

                /**
                 * Creates a new GeoPose instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns GeoPose instance
                 */
                public static create(properties?: havocai.messages.v0.IGeoPose): havocai.messages.v0.GeoPose;

                /**
                 * Encodes the specified GeoPose message. Does not implicitly {@link havocai.messages.v0.GeoPose.verify|verify} messages.
                 * @param message GeoPose message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IGeoPose, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified GeoPose message, length delimited. Does not implicitly {@link havocai.messages.v0.GeoPose.verify|verify} messages.
                 * @param message GeoPose message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IGeoPose, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a GeoPose message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns GeoPose
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.GeoPose;

                /**
                 * Decodes a GeoPose message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns GeoPose
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.GeoPose;

                /**
                 * Verifies a GeoPose message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a GeoPose message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns GeoPose
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.GeoPose;

                /**
                 * Creates a plain object from a GeoPose message. Also converts values to other types if specified.
                 * @param message GeoPose
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.GeoPose, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this GeoPose to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for GeoPose
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a GeoPoint. */
            interface IGeoPoint {

                /** GeoPoint latitude */
                latitude?: (number|null);

                /** GeoPoint longitude */
                longitude?: (number|null);

                /** GeoPoint altitude */
                altitude?: (number|null);
            }

            /** Represents a GeoPoint. */
            class GeoPoint implements IGeoPoint {

                /**
                 * Constructs a new GeoPoint.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IGeoPoint);

                /** GeoPoint latitude. */
                public latitude: number;

                /** GeoPoint longitude. */
                public longitude: number;

                /** GeoPoint altitude. */
                public altitude: number;

                /**
                 * Creates a new GeoPoint instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns GeoPoint instance
                 */
                public static create(properties?: havocai.messages.v0.IGeoPoint): havocai.messages.v0.GeoPoint;

                /**
                 * Encodes the specified GeoPoint message. Does not implicitly {@link havocai.messages.v0.GeoPoint.verify|verify} messages.
                 * @param message GeoPoint message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IGeoPoint, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified GeoPoint message, length delimited. Does not implicitly {@link havocai.messages.v0.GeoPoint.verify|verify} messages.
                 * @param message GeoPoint message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IGeoPoint, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a GeoPoint message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns GeoPoint
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.GeoPoint;

                /**
                 * Decodes a GeoPoint message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns GeoPoint
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.GeoPoint;

                /**
                 * Verifies a GeoPoint message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a GeoPoint message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns GeoPoint
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.GeoPoint;

                /**
                 * Creates a plain object from a GeoPoint message. Also converts values to other types if specified.
                 * @param message GeoPoint
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.GeoPoint, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this GeoPoint to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for GeoPoint
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Quaternion. */
            interface IQuaternion {

                /** Quaternion x */
                x?: (number|null);

                /** Quaternion y */
                y?: (number|null);

                /** Quaternion z */
                z?: (number|null);

                /** Quaternion w */
                w?: (number|null);
            }

            /** Represents a Quaternion. */
            class Quaternion implements IQuaternion {

                /**
                 * Constructs a new Quaternion.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IQuaternion);

                /** Quaternion x. */
                public x: number;

                /** Quaternion y. */
                public y: number;

                /** Quaternion z. */
                public z: number;

                /** Quaternion w. */
                public w: number;

                /**
                 * Creates a new Quaternion instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Quaternion instance
                 */
                public static create(properties?: havocai.messages.v0.IQuaternion): havocai.messages.v0.Quaternion;

                /**
                 * Encodes the specified Quaternion message. Does not implicitly {@link havocai.messages.v0.Quaternion.verify|verify} messages.
                 * @param message Quaternion message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IQuaternion, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Quaternion message, length delimited. Does not implicitly {@link havocai.messages.v0.Quaternion.verify|verify} messages.
                 * @param message Quaternion message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IQuaternion, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Quaternion message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Quaternion
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Quaternion;

                /**
                 * Decodes a Quaternion message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Quaternion
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Quaternion;

                /**
                 * Verifies a Quaternion message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Quaternion message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Quaternion
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Quaternion;

                /**
                 * Creates a plain object from a Quaternion message. Also converts values to other types if specified.
                 * @param message Quaternion
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Quaternion, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Quaternion to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Quaternion
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Metric. */
            interface IMetric {

                /** Metric key */
                key?: (havocai.messages.v0.MetricKey|null);

                /** Metric type */
                type?: (havocai.messages.v0.MetricType|null);

                /** Metric value */
                value?: (number|null);
            }

            /** Represents a Metric. */
            class Metric implements IMetric {

                /**
                 * Constructs a new Metric.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IMetric);

                /** Metric key. */
                public key: havocai.messages.v0.MetricKey;

                /** Metric type. */
                public type: havocai.messages.v0.MetricType;

                /** Metric value. */
                public value: number;

                /**
                 * Creates a new Metric instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Metric instance
                 */
                public static create(properties?: havocai.messages.v0.IMetric): havocai.messages.v0.Metric;

                /**
                 * Encodes the specified Metric message. Does not implicitly {@link havocai.messages.v0.Metric.verify|verify} messages.
                 * @param message Metric message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IMetric, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Metric message, length delimited. Does not implicitly {@link havocai.messages.v0.Metric.verify|verify} messages.
                 * @param message Metric message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IMetric, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Metric message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Metric
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Metric;

                /**
                 * Decodes a Metric message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Metric
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Metric;

                /**
                 * Verifies a Metric message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Metric message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Metric
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Metric;

                /**
                 * Creates a plain object from a Metric message. Also converts values to other types if specified.
                 * @param message Metric
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Metric, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Metric to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Metric
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an Error. */
            interface IError {

                /** Error code */
                code?: (number|null);

                /** Error codeStr */
                codeStr?: (string|null);

                /** Error level */
                level?: (havocai.messages.v0.ErrorLevel|null);

                /** Error message */
                message?: (string|null);

                /** Error timeReported */
                timeReported?: (google.protobuf.ITimestamp|null);
            }

            /** Represents an Error. */
            class Error implements IError {

                /**
                 * Constructs a new Error.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IError);

                /** Error code. */
                public code: number;

                /** Error codeStr. */
                public codeStr: string;

                /** Error level. */
                public level: havocai.messages.v0.ErrorLevel;

                /** Error message. */
                public message: string;

                /** Error timeReported. */
                public timeReported?: (google.protobuf.ITimestamp|null);

                /**
                 * Creates a new Error instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Error instance
                 */
                public static create(properties?: havocai.messages.v0.IError): havocai.messages.v0.Error;

                /**
                 * Encodes the specified Error message. Does not implicitly {@link havocai.messages.v0.Error.verify|verify} messages.
                 * @param message Error message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IError, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Error message, length delimited. Does not implicitly {@link havocai.messages.v0.Error.verify|verify} messages.
                 * @param message Error message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IError, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Error message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Error
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Error;

                /**
                 * Decodes an Error message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Error
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Error;

                /**
                 * Verifies an Error message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Error message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Error
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Error;

                /**
                 * Creates a plain object from an Error message. Also converts values to other types if specified.
                 * @param message Error
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Error, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Error to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Error
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a FrontendContext. */
            interface IFrontendContext {

                /** FrontendContext version */
                version?: (string|null);

                /** FrontendContext gitCommit */
                gitCommit?: (string|null);

                /** FrontendContext buildTime */
                buildTime?: (string|null);

                /** FrontendContext oauthClientId */
                oauthClientId?: (string|null);

                /** FrontendContext oauthAuthorityUrl */
                oauthAuthorityUrl?: (string|null);
            }

            /** Represents a FrontendContext. */
            class FrontendContext implements IFrontendContext {

                /**
                 * Constructs a new FrontendContext.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IFrontendContext);

                /** FrontendContext version. */
                public version: string;

                /** FrontendContext gitCommit. */
                public gitCommit: string;

                /** FrontendContext buildTime. */
                public buildTime: string;

                /** FrontendContext oauthClientId. */
                public oauthClientId: string;

                /** FrontendContext oauthAuthorityUrl. */
                public oauthAuthorityUrl: string;

                /**
                 * Creates a new FrontendContext instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns FrontendContext instance
                 */
                public static create(properties?: havocai.messages.v0.IFrontendContext): havocai.messages.v0.FrontendContext;

                /**
                 * Encodes the specified FrontendContext message. Does not implicitly {@link havocai.messages.v0.FrontendContext.verify|verify} messages.
                 * @param message FrontendContext message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IFrontendContext, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified FrontendContext message, length delimited. Does not implicitly {@link havocai.messages.v0.FrontendContext.verify|verify} messages.
                 * @param message FrontendContext message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IFrontendContext, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a FrontendContext message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns FrontendContext
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.FrontendContext;

                /**
                 * Decodes a FrontendContext message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns FrontendContext
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.FrontendContext;

                /**
                 * Verifies a FrontendContext message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a FrontendContext message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns FrontendContext
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.FrontendContext;

                /**
                 * Creates a plain object from a FrontendContext message. Also converts values to other types if specified.
                 * @param message FrontendContext
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.FrontendContext, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this FrontendContext to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for FrontendContext
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a VehicleState. */
            interface IVehicleState {

                /** VehicleState vehicleInterfaceState */
                vehicleInterfaceState?: (havocai.messages.v0.VehicleInterfaceStateType|null);
            }

            /** Represents a VehicleState. */
            class VehicleState implements IVehicleState {

                /**
                 * Constructs a new VehicleState.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IVehicleState);

                /** VehicleState vehicleInterfaceState. */
                public vehicleInterfaceState: havocai.messages.v0.VehicleInterfaceStateType;

                /**
                 * Creates a new VehicleState instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns VehicleState instance
                 */
                public static create(properties?: havocai.messages.v0.IVehicleState): havocai.messages.v0.VehicleState;

                /**
                 * Encodes the specified VehicleState message. Does not implicitly {@link havocai.messages.v0.VehicleState.verify|verify} messages.
                 * @param message VehicleState message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IVehicleState, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified VehicleState message, length delimited. Does not implicitly {@link havocai.messages.v0.VehicleState.verify|verify} messages.
                 * @param message VehicleState message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IVehicleState, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a VehicleState message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns VehicleState
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.VehicleState;

                /**
                 * Decodes a VehicleState message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns VehicleState
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.VehicleState;

                /**
                 * Verifies a VehicleState message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a VehicleState message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns VehicleState
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.VehicleState;

                /**
                 * Creates a plain object from a VehicleState message. Also converts values to other types if specified.
                 * @param message VehicleState
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.VehicleState, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this VehicleState to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for VehicleState
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a VehicleStateReport. */
            interface IVehicleStateReport {

                /** VehicleStateReport body */
                body?: (havocai.messages.v0.IVehicleState|null);
            }

            /** Represents a VehicleStateReport. */
            class VehicleStateReport implements IVehicleStateReport {

                /**
                 * Constructs a new VehicleStateReport.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IVehicleStateReport);

                /** VehicleStateReport body. */
                public body?: (havocai.messages.v0.IVehicleState|null);

                /**
                 * Creates a new VehicleStateReport instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns VehicleStateReport instance
                 */
                public static create(properties?: havocai.messages.v0.IVehicleStateReport): havocai.messages.v0.VehicleStateReport;

                /**
                 * Encodes the specified VehicleStateReport message. Does not implicitly {@link havocai.messages.v0.VehicleStateReport.verify|verify} messages.
                 * @param message VehicleStateReport message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IVehicleStateReport, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified VehicleStateReport message, length delimited. Does not implicitly {@link havocai.messages.v0.VehicleStateReport.verify|verify} messages.
                 * @param message VehicleStateReport message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IVehicleStateReport, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a VehicleStateReport message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns VehicleStateReport
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.VehicleStateReport;

                /**
                 * Decodes a VehicleStateReport message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns VehicleStateReport
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.VehicleStateReport;

                /**
                 * Verifies a VehicleStateReport message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a VehicleStateReport message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns VehicleStateReport
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.VehicleStateReport;

                /**
                 * Creates a plain object from a VehicleStateReport message. Also converts values to other types if specified.
                 * @param message VehicleStateReport
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.VehicleStateReport, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this VehicleStateReport to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for VehicleStateReport
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a User. */
            interface IUser {

                /** User id */
                id?: (string|null);

                /** User username */
                username?: (string|null);

                /** User realName */
                realName?: (string|null);
            }

            /** Represents a User. */
            class User implements IUser {

                /**
                 * Constructs a new User.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IUser);

                /** User id. */
                public id: string;

                /** User username. */
                public username: string;

                /** User realName. */
                public realName: string;

                /**
                 * Creates a new User instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns User instance
                 */
                public static create(properties?: havocai.messages.v0.IUser): havocai.messages.v0.User;

                /**
                 * Encodes the specified User message. Does not implicitly {@link havocai.messages.v0.User.verify|verify} messages.
                 * @param message User message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IUser, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified User message, length delimited. Does not implicitly {@link havocai.messages.v0.User.verify|verify} messages.
                 * @param message User message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IUser, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a User message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns User
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.User;

                /**
                 * Decodes a User message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns User
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.User;

                /**
                 * Verifies a User message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a User message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns User
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.User;

                /**
                 * Creates a plain object from a User message. Also converts values to other types if specified.
                 * @param message User
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.User, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this User to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for User
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a GeoImage. */
            interface IGeoImage {

                /** GeoImage id */
                id?: (string|null);

                /** GeoImage uri */
                uri?: (string|null);

                /** GeoImage creationTime */
                creationTime?: (number|Long|null);

                /** GeoImage vehicle */
                vehicle?: (havocai.messages.v0.IResourceRef|null);

                /** GeoImage sourcePath */
                sourcePath?: (string|null);

                /** GeoImage referencePosition */
                referencePosition?: (havocai.messages.v0.IGeoPoint|null);

                /** GeoImage bearing */
                bearing?: (number|null);

                /** GeoImage horizontalFov */
                horizontalFov?: (number|null);

                /** GeoImage verticalFov */
                verticalFov?: (number|null);

                /** GeoImage focalLength */
                focalLength?: (number|null);
            }

            /** Represents a GeoImage. */
            class GeoImage implements IGeoImage {

                /**
                 * Constructs a new GeoImage.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IGeoImage);

                /** GeoImage id. */
                public id: string;

                /** GeoImage uri. */
                public uri: string;

                /** GeoImage creationTime. */
                public creationTime: (number|Long);

                /** GeoImage vehicle. */
                public vehicle?: (havocai.messages.v0.IResourceRef|null);

                /** GeoImage sourcePath. */
                public sourcePath: string;

                /** GeoImage referencePosition. */
                public referencePosition?: (havocai.messages.v0.IGeoPoint|null);

                /** GeoImage bearing. */
                public bearing: number;

                /** GeoImage horizontalFov. */
                public horizontalFov: number;

                /** GeoImage verticalFov. */
                public verticalFov: number;

                /** GeoImage focalLength. */
                public focalLength: number;

                /**
                 * Creates a new GeoImage instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns GeoImage instance
                 */
                public static create(properties?: havocai.messages.v0.IGeoImage): havocai.messages.v0.GeoImage;

                /**
                 * Encodes the specified GeoImage message. Does not implicitly {@link havocai.messages.v0.GeoImage.verify|verify} messages.
                 * @param message GeoImage message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IGeoImage, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified GeoImage message, length delimited. Does not implicitly {@link havocai.messages.v0.GeoImage.verify|verify} messages.
                 * @param message GeoImage message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IGeoImage, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a GeoImage message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns GeoImage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.GeoImage;

                /**
                 * Decodes a GeoImage message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns GeoImage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.GeoImage;

                /**
                 * Verifies a GeoImage message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a GeoImage message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns GeoImage
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.GeoImage;

                /**
                 * Creates a plain object from a GeoImage message. Also converts values to other types if specified.
                 * @param message GeoImage
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.GeoImage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this GeoImage to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for GeoImage
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a SectorMarkerRef. */
            interface ISectorMarkerRef {

                /** SectorMarkerRef sectorId */
                sectorId?: (string|null);

                /** SectorMarkerRef markerId */
                markerId?: (string|null);
            }

            /** Represents a SectorMarkerRef. */
            class SectorMarkerRef implements ISectorMarkerRef {

                /**
                 * Constructs a new SectorMarkerRef.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ISectorMarkerRef);

                /** SectorMarkerRef sectorId. */
                public sectorId: string;

                /** SectorMarkerRef markerId. */
                public markerId: string;

                /**
                 * Creates a new SectorMarkerRef instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SectorMarkerRef instance
                 */
                public static create(properties?: havocai.messages.v0.ISectorMarkerRef): havocai.messages.v0.SectorMarkerRef;

                /**
                 * Encodes the specified SectorMarkerRef message. Does not implicitly {@link havocai.messages.v0.SectorMarkerRef.verify|verify} messages.
                 * @param message SectorMarkerRef message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ISectorMarkerRef, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SectorMarkerRef message, length delimited. Does not implicitly {@link havocai.messages.v0.SectorMarkerRef.verify|verify} messages.
                 * @param message SectorMarkerRef message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ISectorMarkerRef, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SectorMarkerRef message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SectorMarkerRef
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.SectorMarkerRef;

                /**
                 * Decodes a SectorMarkerRef message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SectorMarkerRef
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.SectorMarkerRef;

                /**
                 * Verifies a SectorMarkerRef message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SectorMarkerRef message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SectorMarkerRef
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.SectorMarkerRef;

                /**
                 * Creates a plain object from a SectorMarkerRef message. Also converts values to other types if specified.
                 * @param message SectorMarkerRef
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.SectorMarkerRef, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SectorMarkerRef to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for SectorMarkerRef
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a ZoneMarkerRef. */
            interface IZoneMarkerRef {

                /** ZoneMarkerRef zoneId */
                zoneId?: (string|null);

                /** ZoneMarkerRef markerId */
                markerId?: (string|null);
            }

            /** Represents a ZoneMarkerRef. */
            class ZoneMarkerRef implements IZoneMarkerRef {

                /**
                 * Constructs a new ZoneMarkerRef.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IZoneMarkerRef);

                /** ZoneMarkerRef zoneId. */
                public zoneId: string;

                /** ZoneMarkerRef markerId. */
                public markerId: string;

                /**
                 * Creates a new ZoneMarkerRef instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ZoneMarkerRef instance
                 */
                public static create(properties?: havocai.messages.v0.IZoneMarkerRef): havocai.messages.v0.ZoneMarkerRef;

                /**
                 * Encodes the specified ZoneMarkerRef message. Does not implicitly {@link havocai.messages.v0.ZoneMarkerRef.verify|verify} messages.
                 * @param message ZoneMarkerRef message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IZoneMarkerRef, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ZoneMarkerRef message, length delimited. Does not implicitly {@link havocai.messages.v0.ZoneMarkerRef.verify|verify} messages.
                 * @param message ZoneMarkerRef message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IZoneMarkerRef, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ZoneMarkerRef message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ZoneMarkerRef
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.ZoneMarkerRef;

                /**
                 * Decodes a ZoneMarkerRef message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ZoneMarkerRef
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.ZoneMarkerRef;

                /**
                 * Verifies a ZoneMarkerRef message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ZoneMarkerRef message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ZoneMarkerRef
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.ZoneMarkerRef;

                /**
                 * Creates a plain object from a ZoneMarkerRef message. Also converts values to other types if specified.
                 * @param message ZoneMarkerRef
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.ZoneMarkerRef, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ZoneMarkerRef to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ZoneMarkerRef
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Polygon. */
            interface IPolygon {

                /** Polygon geoPoints */
                geoPoints?: (havocai.messages.v0.IGeoPoint[]|null);
            }

            /** Represents a Polygon. */
            class Polygon implements IPolygon {

                /**
                 * Constructs a new Polygon.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IPolygon);

                /** Polygon geoPoints. */
                public geoPoints: havocai.messages.v0.IGeoPoint[];

                /**
                 * Creates a new Polygon instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Polygon instance
                 */
                public static create(properties?: havocai.messages.v0.IPolygon): havocai.messages.v0.Polygon;

                /**
                 * Encodes the specified Polygon message. Does not implicitly {@link havocai.messages.v0.Polygon.verify|verify} messages.
                 * @param message Polygon message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IPolygon, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Polygon message, length delimited. Does not implicitly {@link havocai.messages.v0.Polygon.verify|verify} messages.
                 * @param message Polygon message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IPolygon, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Polygon message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Polygon
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Polygon;

                /**
                 * Decodes a Polygon message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Polygon
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Polygon;

                /**
                 * Verifies a Polygon message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Polygon message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Polygon
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Polygon;

                /**
                 * Creates a plain object from a Polygon message. Also converts values to other types if specified.
                 * @param message Polygon
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Polygon, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Polygon to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Polygon
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a RouteWaypoint. */
            interface IRouteWaypoint {

                /** RouteWaypoint sectorMarker */
                sectorMarker?: (havocai.messages.v0.ISectorMarkerRef|null);

                /** RouteWaypoint geoPoint */
                geoPoint?: (havocai.messages.v0.IGeoPoint|null);

                /** RouteWaypoint targetSpeed */
                targetSpeed?: (number|null);

                /** RouteWaypoint crossTrackErrorMax */
                crossTrackErrorMax?: (number|null);
            }

            /** Represents a RouteWaypoint. */
            class RouteWaypoint implements IRouteWaypoint {

                /**
                 * Constructs a new RouteWaypoint.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IRouteWaypoint);

                /** RouteWaypoint sectorMarker. */
                public sectorMarker?: (havocai.messages.v0.ISectorMarkerRef|null);

                /** RouteWaypoint geoPoint. */
                public geoPoint?: (havocai.messages.v0.IGeoPoint|null);

                /** RouteWaypoint targetSpeed. */
                public targetSpeed: number;

                /** RouteWaypoint crossTrackErrorMax. */
                public crossTrackErrorMax: number;

                /** RouteWaypoint location. */
                public location?: ("sectorMarker"|"geoPoint");

                /**
                 * Creates a new RouteWaypoint instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns RouteWaypoint instance
                 */
                public static create(properties?: havocai.messages.v0.IRouteWaypoint): havocai.messages.v0.RouteWaypoint;

                /**
                 * Encodes the specified RouteWaypoint message. Does not implicitly {@link havocai.messages.v0.RouteWaypoint.verify|verify} messages.
                 * @param message RouteWaypoint message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IRouteWaypoint, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified RouteWaypoint message, length delimited. Does not implicitly {@link havocai.messages.v0.RouteWaypoint.verify|verify} messages.
                 * @param message RouteWaypoint message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IRouteWaypoint, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a RouteWaypoint message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns RouteWaypoint
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.RouteWaypoint;

                /**
                 * Decodes a RouteWaypoint message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns RouteWaypoint
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.RouteWaypoint;

                /**
                 * Verifies a RouteWaypoint message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a RouteWaypoint message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns RouteWaypoint
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.RouteWaypoint;

                /**
                 * Creates a plain object from a RouteWaypoint message. Also converts values to other types if specified.
                 * @param message RouteWaypoint
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.RouteWaypoint, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this RouteWaypoint to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for RouteWaypoint
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Route. */
            interface IRoute {

                /** Route waypoints */
                waypoints?: (havocai.messages.v0.IRouteWaypoint[]|null);
            }

            /** Represents a Route. */
            class Route implements IRoute {

                /**
                 * Constructs a new Route.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IRoute);

                /** Route waypoints. */
                public waypoints: havocai.messages.v0.IRouteWaypoint[];

                /**
                 * Creates a new Route instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Route instance
                 */
                public static create(properties?: havocai.messages.v0.IRoute): havocai.messages.v0.Route;

                /**
                 * Encodes the specified Route message. Does not implicitly {@link havocai.messages.v0.Route.verify|verify} messages.
                 * @param message Route message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IRoute, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Route message, length delimited. Does not implicitly {@link havocai.messages.v0.Route.verify|verify} messages.
                 * @param message Route message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IRoute, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Route message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Route
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Route;

                /**
                 * Decodes a Route message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Route
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Route;

                /**
                 * Verifies a Route message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Route message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Route
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Route;

                /**
                 * Creates a plain object from a Route message. Also converts values to other types if specified.
                 * @param message Route
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Route, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Route to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Route
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Rule. */
            interface IRule {

                /** Rule resourceKinds */
                resourceKinds?: (havocai.messages.v0.ResourceKind[]|null);

                /** Rule resourceIds */
                resourceIds?: (string[]|null);

                /** Rule verbs */
                verbs?: (string[]|null);
            }

            /** Represents a Rule. */
            class Rule implements IRule {

                /**
                 * Constructs a new Rule.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IRule);

                /** Rule resourceKinds. */
                public resourceKinds: havocai.messages.v0.ResourceKind[];

                /** Rule resourceIds. */
                public resourceIds: string[];

                /** Rule verbs. */
                public verbs: string[];

                /**
                 * Creates a new Rule instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Rule instance
                 */
                public static create(properties?: havocai.messages.v0.IRule): havocai.messages.v0.Rule;

                /**
                 * Encodes the specified Rule message. Does not implicitly {@link havocai.messages.v0.Rule.verify|verify} messages.
                 * @param message Rule message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IRule, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Rule message, length delimited. Does not implicitly {@link havocai.messages.v0.Rule.verify|verify} messages.
                 * @param message Rule message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IRule, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Rule message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Rule
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Rule;

                /**
                 * Decodes a Rule message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Rule
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Rule;

                /**
                 * Verifies a Rule message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Rule message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Rule
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Rule;

                /**
                 * Creates a plain object from a Rule message. Also converts values to other types if specified.
                 * @param message Rule
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Rule, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Rule to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Rule
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an ExecuteCommand. */
            interface IExecuteCommand {

                /** ExecuteCommand command */
                command?: (havocai.messages.v0.Command|null);

                /** ExecuteCommand taskExecutionId */
                taskExecutionId?: (string|null);
            }

            /** Represents an ExecuteCommand. */
            class ExecuteCommand implements IExecuteCommand {

                /**
                 * Constructs a new ExecuteCommand.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IExecuteCommand);

                /** ExecuteCommand command. */
                public command: havocai.messages.v0.Command;

                /** ExecuteCommand taskExecutionId. */
                public taskExecutionId: string;

                /**
                 * Creates a new ExecuteCommand instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ExecuteCommand instance
                 */
                public static create(properties?: havocai.messages.v0.IExecuteCommand): havocai.messages.v0.ExecuteCommand;

                /**
                 * Encodes the specified ExecuteCommand message. Does not implicitly {@link havocai.messages.v0.ExecuteCommand.verify|verify} messages.
                 * @param message ExecuteCommand message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IExecuteCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ExecuteCommand message, length delimited. Does not implicitly {@link havocai.messages.v0.ExecuteCommand.verify|verify} messages.
                 * @param message ExecuteCommand message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IExecuteCommand, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ExecuteCommand message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ExecuteCommand
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.ExecuteCommand;

                /**
                 * Decodes an ExecuteCommand message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ExecuteCommand
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.ExecuteCommand;

                /**
                 * Verifies an ExecuteCommand message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an ExecuteCommand message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ExecuteCommand
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.ExecuteCommand;

                /**
                 * Creates a plain object from an ExecuteCommand message. Also converts values to other types if specified.
                 * @param message ExecuteCommand
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.ExecuteCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ExecuteCommand to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ExecuteCommand
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Sector. */
            interface ISector {

                /** Sector meta */
                meta?: (havocai.messages.v0.IMetadata|null);

                /** Sector area */
                area?: (havocai.messages.v0.IGeoPoint[]|null);

                /** Sector geoFences */
                geoFences?: (havocai.messages.v0.IGeoFence[]|null);

                /** Sector markers */
                markers?: (havocai.messages.v0.IMarker[]|null);

                /** Sector commandUser */
                commandUser?: (havocai.messages.v0.IUser|null);

                /** Sector status */
                status?: (havocai.messages.v0.ISectorStatus|null);
            }

            /** Represents a Sector. */
            class Sector implements ISector {

                /**
                 * Constructs a new Sector.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ISector);

                /** Sector meta. */
                public meta?: (havocai.messages.v0.IMetadata|null);

                /** Sector area. */
                public area: havocai.messages.v0.IGeoPoint[];

                /** Sector geoFences. */
                public geoFences: havocai.messages.v0.IGeoFence[];

                /** Sector markers. */
                public markers: havocai.messages.v0.IMarker[];

                /** Sector commandUser. */
                public commandUser?: (havocai.messages.v0.IUser|null);

                /** Sector status. */
                public status?: (havocai.messages.v0.ISectorStatus|null);

                /**
                 * Creates a new Sector instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Sector instance
                 */
                public static create(properties?: havocai.messages.v0.ISector): havocai.messages.v0.Sector;

                /**
                 * Encodes the specified Sector message. Does not implicitly {@link havocai.messages.v0.Sector.verify|verify} messages.
                 * @param message Sector message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ISector, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Sector message, length delimited. Does not implicitly {@link havocai.messages.v0.Sector.verify|verify} messages.
                 * @param message Sector message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ISector, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Sector message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Sector
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Sector;

                /**
                 * Decodes a Sector message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Sector
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Sector;

                /**
                 * Verifies a Sector message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Sector message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Sector
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Sector;

                /**
                 * Creates a plain object from a Sector message. Also converts values to other types if specified.
                 * @param message Sector
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Sector, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Sector to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Sector
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a SectorStatus. */
            interface ISectorStatus {

                /** SectorStatus revisionTime */
                revisionTime?: (number|Long|null);

                /** SectorStatus teams */
                teams?: (havocai.messages.v0.IResourceRef[]|null);

                /** SectorStatus assignedBoats */
                assignedBoats?: (havocai.messages.v0.IResourceRef[]|null);

                /** SectorStatus unassignedBoats */
                unassignedBoats?: (havocai.messages.v0.IResourceRef[]|null);
            }

            /** Represents a SectorStatus. */
            class SectorStatus implements ISectorStatus {

                /**
                 * Constructs a new SectorStatus.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ISectorStatus);

                /** SectorStatus revisionTime. */
                public revisionTime: (number|Long);

                /** SectorStatus teams. */
                public teams: havocai.messages.v0.IResourceRef[];

                /** SectorStatus assignedBoats. */
                public assignedBoats: havocai.messages.v0.IResourceRef[];

                /** SectorStatus unassignedBoats. */
                public unassignedBoats: havocai.messages.v0.IResourceRef[];

                /**
                 * Creates a new SectorStatus instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SectorStatus instance
                 */
                public static create(properties?: havocai.messages.v0.ISectorStatus): havocai.messages.v0.SectorStatus;

                /**
                 * Encodes the specified SectorStatus message. Does not implicitly {@link havocai.messages.v0.SectorStatus.verify|verify} messages.
                 * @param message SectorStatus message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ISectorStatus, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SectorStatus message, length delimited. Does not implicitly {@link havocai.messages.v0.SectorStatus.verify|verify} messages.
                 * @param message SectorStatus message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ISectorStatus, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SectorStatus message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SectorStatus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.SectorStatus;

                /**
                 * Decodes a SectorStatus message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SectorStatus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.SectorStatus;

                /**
                 * Verifies a SectorStatus message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SectorStatus message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SectorStatus
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.SectorStatus;

                /**
                 * Creates a plain object from a SectorStatus message. Also converts values to other types if specified.
                 * @param message SectorStatus
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.SectorStatus, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SectorStatus to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for SectorStatus
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a SectorList. */
            interface ISectorList {

                /** SectorList values */
                values?: (havocai.messages.v0.ISector[]|null);
            }

            /** Represents a SectorList. */
            class SectorList implements ISectorList {

                /**
                 * Constructs a new SectorList.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ISectorList);

                /** SectorList values. */
                public values: havocai.messages.v0.ISector[];

                /**
                 * Creates a new SectorList instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SectorList instance
                 */
                public static create(properties?: havocai.messages.v0.ISectorList): havocai.messages.v0.SectorList;

                /**
                 * Encodes the specified SectorList message. Does not implicitly {@link havocai.messages.v0.SectorList.verify|verify} messages.
                 * @param message SectorList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ISectorList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SectorList message, length delimited. Does not implicitly {@link havocai.messages.v0.SectorList.verify|verify} messages.
                 * @param message SectorList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ISectorList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SectorList message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SectorList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.SectorList;

                /**
                 * Decodes a SectorList message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SectorList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.SectorList;

                /**
                 * Verifies a SectorList message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SectorList message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SectorList
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.SectorList;

                /**
                 * Creates a plain object from a SectorList message. Also converts values to other types if specified.
                 * @param message SectorList
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.SectorList, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SectorList to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for SectorList
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Zone. */
            interface IZone {

                /** Zone meta */
                meta?: (havocai.messages.v0.IMetadata|null);

                /** Zone type */
                type?: (havocai.messages.v0.ZoneType|null);

                /** Zone sector */
                sector?: (havocai.messages.v0.IResourceRef|null);

                /** Zone imageUrl */
                imageUrl?: (string|null);

                /** Zone waypoints */
                waypoints?: (havocai.messages.v0.IWaypoint[]|null);

                /** Zone area */
                area?: (havocai.messages.v0.IGeoPoint[]|null);

                /** Zone markers */
                markers?: (havocai.messages.v0.IMarker[]|null);
            }

            /** Represents a Zone. */
            class Zone implements IZone {

                /**
                 * Constructs a new Zone.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IZone);

                /** Zone meta. */
                public meta?: (havocai.messages.v0.IMetadata|null);

                /** Zone type. */
                public type: havocai.messages.v0.ZoneType;

                /** Zone sector. */
                public sector?: (havocai.messages.v0.IResourceRef|null);

                /** Zone imageUrl. */
                public imageUrl: string;

                /** Zone waypoints. */
                public waypoints: havocai.messages.v0.IWaypoint[];

                /** Zone area. */
                public area: havocai.messages.v0.IGeoPoint[];

                /** Zone markers. */
                public markers: havocai.messages.v0.IMarker[];

                /**
                 * Creates a new Zone instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Zone instance
                 */
                public static create(properties?: havocai.messages.v0.IZone): havocai.messages.v0.Zone;

                /**
                 * Encodes the specified Zone message. Does not implicitly {@link havocai.messages.v0.Zone.verify|verify} messages.
                 * @param message Zone message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IZone, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Zone message, length delimited. Does not implicitly {@link havocai.messages.v0.Zone.verify|verify} messages.
                 * @param message Zone message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IZone, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Zone message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Zone
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Zone;

                /**
                 * Decodes a Zone message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Zone
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Zone;

                /**
                 * Verifies a Zone message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Zone message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Zone
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Zone;

                /**
                 * Creates a plain object from a Zone message. Also converts values to other types if specified.
                 * @param message Zone
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Zone, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Zone to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Zone
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a ZoneList. */
            interface IZoneList {

                /** ZoneList values */
                values?: (havocai.messages.v0.IZone[]|null);
            }

            /** Represents a ZoneList. */
            class ZoneList implements IZoneList {

                /**
                 * Constructs a new ZoneList.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IZoneList);

                /** ZoneList values. */
                public values: havocai.messages.v0.IZone[];

                /**
                 * Creates a new ZoneList instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ZoneList instance
                 */
                public static create(properties?: havocai.messages.v0.IZoneList): havocai.messages.v0.ZoneList;

                /**
                 * Encodes the specified ZoneList message. Does not implicitly {@link havocai.messages.v0.ZoneList.verify|verify} messages.
                 * @param message ZoneList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IZoneList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ZoneList message, length delimited. Does not implicitly {@link havocai.messages.v0.ZoneList.verify|verify} messages.
                 * @param message ZoneList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IZoneList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ZoneList message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ZoneList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.ZoneList;

                /**
                 * Decodes a ZoneList message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ZoneList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.ZoneList;

                /**
                 * Verifies a ZoneList message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ZoneList message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ZoneList
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.ZoneList;

                /**
                 * Creates a plain object from a ZoneList message. Also converts values to other types if specified.
                 * @param message ZoneList
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.ZoneList, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ZoneList to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ZoneList
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Track. */
            interface ITrack {

                /** Track meta */
                meta?: (havocai.messages.v0.IMetadata|null);

                /** Track type */
                type?: (havocai.messages.v0.TrackType|null);

                /** Track position */
                position?: (havocai.messages.v0.IGeoPose|null);

                /** Track heading */
                heading?: (number|null);

                /** Track course */
                course?: (number|null);

                /** Track speed */
                speed?: (number|null);

                /** Track affiliation */
                affiliation?: (havocai.messages.v0.Affiliation|null);

                /** Track typeCredibility */
                typeCredibility?: (havocai.messages.v0.CredibilityRating|null);

                /** Track positionCredibility */
                positionCredibility?: (havocai.messages.v0.CredibilityRating|null);

                /** Track affiliationCredibility */
                affiliationCredibility?: (havocai.messages.v0.CredibilityRating|null);

                /** Track images */
                images?: (havocai.messages.v0.IGeoImage[]|null);

                /** Track status */
                status?: (havocai.messages.v0.ITrackStatus|null);
            }

            /** Represents a Track. */
            class Track implements ITrack {

                /**
                 * Constructs a new Track.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ITrack);

                /** Track meta. */
                public meta?: (havocai.messages.v0.IMetadata|null);

                /** Track type. */
                public type: havocai.messages.v0.TrackType;

                /** Track position. */
                public position?: (havocai.messages.v0.IGeoPose|null);

                /** Track heading. */
                public heading: number;

                /** Track course. */
                public course: number;

                /** Track speed. */
                public speed: number;

                /** Track affiliation. */
                public affiliation: havocai.messages.v0.Affiliation;

                /** Track typeCredibility. */
                public typeCredibility: havocai.messages.v0.CredibilityRating;

                /** Track positionCredibility. */
                public positionCredibility: havocai.messages.v0.CredibilityRating;

                /** Track affiliationCredibility. */
                public affiliationCredibility: havocai.messages.v0.CredibilityRating;

                /** Track images. */
                public images: havocai.messages.v0.IGeoImage[];

                /** Track status. */
                public status?: (havocai.messages.v0.ITrackStatus|null);

                /**
                 * Creates a new Track instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Track instance
                 */
                public static create(properties?: havocai.messages.v0.ITrack): havocai.messages.v0.Track;

                /**
                 * Encodes the specified Track message. Does not implicitly {@link havocai.messages.v0.Track.verify|verify} messages.
                 * @param message Track message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ITrack, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Track message, length delimited. Does not implicitly {@link havocai.messages.v0.Track.verify|verify} messages.
                 * @param message Track message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ITrack, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Track message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Track
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Track;

                /**
                 * Decodes a Track message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Track
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Track;

                /**
                 * Verifies a Track message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Track message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Track
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Track;

                /**
                 * Creates a plain object from a Track message. Also converts values to other types if specified.
                 * @param message Track
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Track, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Track to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Track
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TrackStatus. */
            interface ITrackStatus {

                /** TrackStatus revisionTime */
                revisionTime?: (number|Long|null);

                /** TrackStatus trace */
                trace?: (havocai.messages.v0.IGeoPose[]|null);

                /** TrackStatus typeConfidence */
                typeConfidence?: (number|null);

                /** TrackStatus positionConfidence */
                positionConfidence?: (number|null);

                /** TrackStatus affiliationConfidence */
                affiliationConfidence?: (number|null);
            }

            /** Represents a TrackStatus. */
            class TrackStatus implements ITrackStatus {

                /**
                 * Constructs a new TrackStatus.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ITrackStatus);

                /** TrackStatus revisionTime. */
                public revisionTime: (number|Long);

                /** TrackStatus trace. */
                public trace: havocai.messages.v0.IGeoPose[];

                /** TrackStatus typeConfidence. */
                public typeConfidence: number;

                /** TrackStatus positionConfidence. */
                public positionConfidence: number;

                /** TrackStatus affiliationConfidence. */
                public affiliationConfidence: number;

                /**
                 * Creates a new TrackStatus instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TrackStatus instance
                 */
                public static create(properties?: havocai.messages.v0.ITrackStatus): havocai.messages.v0.TrackStatus;

                /**
                 * Encodes the specified TrackStatus message. Does not implicitly {@link havocai.messages.v0.TrackStatus.verify|verify} messages.
                 * @param message TrackStatus message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ITrackStatus, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TrackStatus message, length delimited. Does not implicitly {@link havocai.messages.v0.TrackStatus.verify|verify} messages.
                 * @param message TrackStatus message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ITrackStatus, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TrackStatus message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TrackStatus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.TrackStatus;

                /**
                 * Decodes a TrackStatus message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TrackStatus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.TrackStatus;

                /**
                 * Verifies a TrackStatus message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TrackStatus message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TrackStatus
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.TrackStatus;

                /**
                 * Creates a plain object from a TrackStatus message. Also converts values to other types if specified.
                 * @param message TrackStatus
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.TrackStatus, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TrackStatus to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TrackStatus
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TrackList. */
            interface ITrackList {

                /** TrackList values */
                values?: (havocai.messages.v0.ITrack[]|null);
            }

            /** Represents a TrackList. */
            class TrackList implements ITrackList {

                /**
                 * Constructs a new TrackList.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ITrackList);

                /** TrackList values. */
                public values: havocai.messages.v0.ITrack[];

                /**
                 * Creates a new TrackList instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TrackList instance
                 */
                public static create(properties?: havocai.messages.v0.ITrackList): havocai.messages.v0.TrackList;

                /**
                 * Encodes the specified TrackList message. Does not implicitly {@link havocai.messages.v0.TrackList.verify|verify} messages.
                 * @param message TrackList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ITrackList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TrackList message, length delimited. Does not implicitly {@link havocai.messages.v0.TrackList.verify|verify} messages.
                 * @param message TrackList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ITrackList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TrackList message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TrackList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.TrackList;

                /**
                 * Decodes a TrackList message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TrackList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.TrackList;

                /**
                 * Verifies a TrackList message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TrackList message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TrackList
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.TrackList;

                /**
                 * Creates a plain object from a TrackList message. Also converts values to other types if specified.
                 * @param message TrackList
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.TrackList, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TrackList to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TrackList
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Team. */
            interface ITeam {

                /** Team meta */
                meta?: (havocai.messages.v0.IMetadata|null);

                /** Team sector */
                sector?: (havocai.messages.v0.IResourceRef|null);

                /** Team boats */
                boats?: (havocai.messages.v0.IResourceRef[]|null);

                /** Team geoFences */
                geoFences?: (havocai.messages.v0.IGeoFence[]|null);

                /** Team commandUser */
                commandUser?: (havocai.messages.v0.IUser|null);

                /** Team status */
                status?: (havocai.messages.v0.ITeamStatus|null);
            }

            /** Represents a Team. */
            class Team implements ITeam {

                /**
                 * Constructs a new Team.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ITeam);

                /** Team meta. */
                public meta?: (havocai.messages.v0.IMetadata|null);

                /** Team sector. */
                public sector?: (havocai.messages.v0.IResourceRef|null);

                /** Team boats. */
                public boats: havocai.messages.v0.IResourceRef[];

                /** Team geoFences. */
                public geoFences: havocai.messages.v0.IGeoFence[];

                /** Team commandUser. */
                public commandUser?: (havocai.messages.v0.IUser|null);

                /** Team status. */
                public status?: (havocai.messages.v0.ITeamStatus|null);

                /**
                 * Creates a new Team instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Team instance
                 */
                public static create(properties?: havocai.messages.v0.ITeam): havocai.messages.v0.Team;

                /**
                 * Encodes the specified Team message. Does not implicitly {@link havocai.messages.v0.Team.verify|verify} messages.
                 * @param message Team message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ITeam, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Team message, length delimited. Does not implicitly {@link havocai.messages.v0.Team.verify|verify} messages.
                 * @param message Team message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ITeam, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Team message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Team
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Team;

                /**
                 * Decodes a Team message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Team
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Team;

                /**
                 * Verifies a Team message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Team message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Team
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Team;

                /**
                 * Creates a plain object from a Team message. Also converts values to other types if specified.
                 * @param message Team
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Team, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Team to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Team
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TeamStatus. */
            interface ITeamStatus {

                /** TeamStatus revisionTime */
                revisionTime?: (number|Long|null);

                /** TeamStatus play */
                play?: (havocai.messages.v0.IPlayStatus|null);

                /** TeamStatus playExecution */
                playExecution?: (havocai.messages.v0.IResourceRef|null);

                /** TeamStatus routeCorridor */
                routeCorridor?: (havocai.messages.v0.IGeoPoint[]|null);
            }

            /** Represents a TeamStatus. */
            class TeamStatus implements ITeamStatus {

                /**
                 * Constructs a new TeamStatus.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ITeamStatus);

                /** TeamStatus revisionTime. */
                public revisionTime: (number|Long);

                /** TeamStatus play. */
                public play?: (havocai.messages.v0.IPlayStatus|null);

                /** TeamStatus playExecution. */
                public playExecution?: (havocai.messages.v0.IResourceRef|null);

                /** TeamStatus routeCorridor. */
                public routeCorridor: havocai.messages.v0.IGeoPoint[];

                /**
                 * Creates a new TeamStatus instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TeamStatus instance
                 */
                public static create(properties?: havocai.messages.v0.ITeamStatus): havocai.messages.v0.TeamStatus;

                /**
                 * Encodes the specified TeamStatus message. Does not implicitly {@link havocai.messages.v0.TeamStatus.verify|verify} messages.
                 * @param message TeamStatus message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ITeamStatus, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TeamStatus message, length delimited. Does not implicitly {@link havocai.messages.v0.TeamStatus.verify|verify} messages.
                 * @param message TeamStatus message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ITeamStatus, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TeamStatus message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TeamStatus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.TeamStatus;

                /**
                 * Decodes a TeamStatus message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TeamStatus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.TeamStatus;

                /**
                 * Verifies a TeamStatus message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TeamStatus message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TeamStatus
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.TeamStatus;

                /**
                 * Creates a plain object from a TeamStatus message. Also converts values to other types if specified.
                 * @param message TeamStatus
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.TeamStatus, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TeamStatus to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TeamStatus
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TeamList. */
            interface ITeamList {

                /** TeamList values */
                values?: (havocai.messages.v0.ITeam[]|null);
            }

            /** Represents a TeamList. */
            class TeamList implements ITeamList {

                /**
                 * Constructs a new TeamList.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ITeamList);

                /** TeamList values. */
                public values: havocai.messages.v0.ITeam[];

                /**
                 * Creates a new TeamList instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TeamList instance
                 */
                public static create(properties?: havocai.messages.v0.ITeamList): havocai.messages.v0.TeamList;

                /**
                 * Encodes the specified TeamList message. Does not implicitly {@link havocai.messages.v0.TeamList.verify|verify} messages.
                 * @param message TeamList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ITeamList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TeamList message, length delimited. Does not implicitly {@link havocai.messages.v0.TeamList.verify|verify} messages.
                 * @param message TeamList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ITeamList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TeamList message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TeamList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.TeamList;

                /**
                 * Decodes a TeamList message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TeamList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.TeamList;

                /**
                 * Verifies a TeamList message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TeamList message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TeamList
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.TeamList;

                /**
                 * Creates a plain object from a TeamList message. Also converts values to other types if specified.
                 * @param message TeamList
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.TeamList, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TeamList to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TeamList
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Boat. */
            interface IBoat {

                /** Boat meta */
                meta?: (havocai.messages.v0.IMetadata|null);

                /** Boat team */
                team?: (havocai.messages.v0.IResourceRef|null);

                /** Boat type */
                type?: (havocai.messages.v0.VehicleType|null);

                /** Boat sizeClass */
                sizeClass?: (havocai.messages.v0.VehicleSizeClass|null);

                /** Boat status */
                status?: (havocai.messages.v0.IBoatStatus|null);
            }

            /** Represents a Boat. */
            class Boat implements IBoat {

                /**
                 * Constructs a new Boat.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IBoat);

                /** Boat meta. */
                public meta?: (havocai.messages.v0.IMetadata|null);

                /** Boat team. */
                public team?: (havocai.messages.v0.IResourceRef|null);

                /** Boat type. */
                public type: havocai.messages.v0.VehicleType;

                /** Boat sizeClass. */
                public sizeClass: havocai.messages.v0.VehicleSizeClass;

                /** Boat status. */
                public status?: (havocai.messages.v0.IBoatStatus|null);

                /**
                 * Creates a new Boat instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Boat instance
                 */
                public static create(properties?: havocai.messages.v0.IBoat): havocai.messages.v0.Boat;

                /**
                 * Encodes the specified Boat message. Does not implicitly {@link havocai.messages.v0.Boat.verify|verify} messages.
                 * @param message Boat message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IBoat, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Boat message, length delimited. Does not implicitly {@link havocai.messages.v0.Boat.verify|verify} messages.
                 * @param message Boat message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IBoat, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Boat message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Boat
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Boat;

                /**
                 * Decodes a Boat message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Boat
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Boat;

                /**
                 * Verifies a Boat message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Boat message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Boat
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Boat;

                /**
                 * Creates a plain object from a Boat message. Also converts values to other types if specified.
                 * @param message Boat
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Boat, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Boat to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Boat
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a BoatStatus. */
            interface IBoatStatus {

                /** BoatStatus revisionTime */
                revisionTime?: (number|Long|null);

                /** BoatStatus position */
                position?: (havocai.messages.v0.IGeoPose|null);

                /** BoatStatus heading */
                heading?: (number|null);

                /** BoatStatus course */
                course?: (number|null);

                /** BoatStatus velocityEast */
                velocityEast?: (number|null);

                /** BoatStatus velocityNorth */
                velocityNorth?: (number|null);

                /** BoatStatus speed */
                speed?: (number|null);

                /** BoatStatus task */
                task?: (havocai.messages.v0.ITask|null);

                /** BoatStatus taskExecution */
                taskExecution?: (havocai.messages.v0.ITaskExecutionStatus|null);

                /** BoatStatus playExecution */
                playExecution?: (havocai.messages.v0.IResourceRef|null);

                /** BoatStatus route */
                route?: (havocai.messages.v0.IGeoPoint[]|null);

                /** BoatStatus trace */
                trace?: (havocai.messages.v0.IGeoPose[]|null);

                /** BoatStatus sector */
                sector?: (havocai.messages.v0.IResourceRef|null);

                /** BoatStatus vehicleArmed */
                vehicleArmed?: (boolean|null);

                /** BoatStatus vehicleInterfaceState */
                vehicleInterfaceState?: (havocai.messages.v0.VehicleInterfaceStateType|null);

                /** BoatStatus thirdPartyData */
                thirdPartyData?: (Uint8Array|null);

                /** BoatStatus components */
                components?: (havocai.messages.v0.IComponent[]|null);

                /** BoatStatus metrics */
                metrics?: (havocai.messages.v0.IMetric[]|null);

                /** BoatStatus videoStreamUrls */
                videoStreamUrls?: (string[]|null);

                /** BoatStatus cdrState */
                cdrState?: (havocai.messages.v0.CDRState|null);

                /** BoatStatus errors */
                errors?: (havocai.messages.v0.IError[]|null);
            }

            /** Represents a BoatStatus. */
            class BoatStatus implements IBoatStatus {

                /**
                 * Constructs a new BoatStatus.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IBoatStatus);

                /** BoatStatus revisionTime. */
                public revisionTime: (number|Long);

                /** BoatStatus position. */
                public position?: (havocai.messages.v0.IGeoPose|null);

                /** BoatStatus heading. */
                public heading: number;

                /** BoatStatus course. */
                public course: number;

                /** BoatStatus velocityEast. */
                public velocityEast: number;

                /** BoatStatus velocityNorth. */
                public velocityNorth: number;

                /** BoatStatus speed. */
                public speed: number;

                /** BoatStatus task. */
                public task?: (havocai.messages.v0.ITask|null);

                /** BoatStatus taskExecution. */
                public taskExecution?: (havocai.messages.v0.ITaskExecutionStatus|null);

                /** BoatStatus playExecution. */
                public playExecution?: (havocai.messages.v0.IResourceRef|null);

                /** BoatStatus route. */
                public route: havocai.messages.v0.IGeoPoint[];

                /** BoatStatus trace. */
                public trace: havocai.messages.v0.IGeoPose[];

                /** BoatStatus sector. */
                public sector?: (havocai.messages.v0.IResourceRef|null);

                /** BoatStatus vehicleArmed. */
                public vehicleArmed: boolean;

                /** BoatStatus vehicleInterfaceState. */
                public vehicleInterfaceState: havocai.messages.v0.VehicleInterfaceStateType;

                /** BoatStatus thirdPartyData. */
                public thirdPartyData: Uint8Array;

                /** BoatStatus components. */
                public components: havocai.messages.v0.IComponent[];

                /** BoatStatus metrics. */
                public metrics: havocai.messages.v0.IMetric[];

                /** BoatStatus videoStreamUrls. */
                public videoStreamUrls: string[];

                /** BoatStatus cdrState. */
                public cdrState: havocai.messages.v0.CDRState;

                /** BoatStatus errors. */
                public errors: havocai.messages.v0.IError[];

                /**
                 * Creates a new BoatStatus instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns BoatStatus instance
                 */
                public static create(properties?: havocai.messages.v0.IBoatStatus): havocai.messages.v0.BoatStatus;

                /**
                 * Encodes the specified BoatStatus message. Does not implicitly {@link havocai.messages.v0.BoatStatus.verify|verify} messages.
                 * @param message BoatStatus message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IBoatStatus, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified BoatStatus message, length delimited. Does not implicitly {@link havocai.messages.v0.BoatStatus.verify|verify} messages.
                 * @param message BoatStatus message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IBoatStatus, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a BoatStatus message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns BoatStatus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.BoatStatus;

                /**
                 * Decodes a BoatStatus message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns BoatStatus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.BoatStatus;

                /**
                 * Verifies a BoatStatus message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a BoatStatus message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns BoatStatus
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.BoatStatus;

                /**
                 * Creates a plain object from a BoatStatus message. Also converts values to other types if specified.
                 * @param message BoatStatus
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.BoatStatus, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this BoatStatus to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for BoatStatus
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a BoatList. */
            interface IBoatList {

                /** BoatList values */
                values?: (havocai.messages.v0.IBoat[]|null);
            }

            /** Represents a BoatList. */
            class BoatList implements IBoatList {

                /**
                 * Constructs a new BoatList.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IBoatList);

                /** BoatList values. */
                public values: havocai.messages.v0.IBoat[];

                /**
                 * Creates a new BoatList instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns BoatList instance
                 */
                public static create(properties?: havocai.messages.v0.IBoatList): havocai.messages.v0.BoatList;

                /**
                 * Encodes the specified BoatList message. Does not implicitly {@link havocai.messages.v0.BoatList.verify|verify} messages.
                 * @param message BoatList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IBoatList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified BoatList message, length delimited. Does not implicitly {@link havocai.messages.v0.BoatList.verify|verify} messages.
                 * @param message BoatList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IBoatList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a BoatList message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns BoatList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.BoatList;

                /**
                 * Decodes a BoatList message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns BoatList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.BoatList;

                /**
                 * Verifies a BoatList message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a BoatList message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns BoatList
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.BoatList;

                /**
                 * Creates a plain object from a BoatList message. Also converts values to other types if specified.
                 * @param message BoatList
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.BoatList, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this BoatList to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for BoatList
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an Event. */
            interface IEvent {

                /** Event id */
                id?: (string|null);

                /** Event type */
                type?: (havocai.messages.v0.EventType|null);

                /** Event creationTime */
                creationTime?: (number|Long|null);

                /** Event eventTime */
                eventTime?: (number|Long|null);

                /** Event resourceRef */
                resourceRef?: (havocai.messages.v0.IResourceRef|null);

                /** Event sector */
                sector?: (havocai.messages.v0.ISector|null);

                /** Event track */
                track?: (havocai.messages.v0.ITrack|null);

                /** Event zone */
                zone?: (havocai.messages.v0.IZone|null);

                /** Event team */
                team?: (havocai.messages.v0.ITeam|null);

                /** Event boat */
                boat?: (havocai.messages.v0.IBoat|null);

                /** Event playDefinition */
                playDefinition?: (havocai.messages.v0.IPlayDefinition|null);

                /** Event playExecution */
                playExecution?: (havocai.messages.v0.IPlayExecution|null);
            }

            /** Represents an Event. */
            class Event implements IEvent {

                /**
                 * Constructs a new Event.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IEvent);

                /** Event id. */
                public id: string;

                /** Event type. */
                public type: havocai.messages.v0.EventType;

                /** Event creationTime. */
                public creationTime: (number|Long);

                /** Event eventTime. */
                public eventTime: (number|Long);

                /** Event resourceRef. */
                public resourceRef?: (havocai.messages.v0.IResourceRef|null);

                /** Event sector. */
                public sector?: (havocai.messages.v0.ISector|null);

                /** Event track. */
                public track?: (havocai.messages.v0.ITrack|null);

                /** Event zone. */
                public zone?: (havocai.messages.v0.IZone|null);

                /** Event team. */
                public team?: (havocai.messages.v0.ITeam|null);

                /** Event boat. */
                public boat?: (havocai.messages.v0.IBoat|null);

                /** Event playDefinition. */
                public playDefinition?: (havocai.messages.v0.IPlayDefinition|null);

                /** Event playExecution. */
                public playExecution?: (havocai.messages.v0.IPlayExecution|null);

                /** Event resource. */
                public resource?: ("sector"|"track"|"zone"|"team"|"boat"|"playDefinition"|"playExecution");

                /**
                 * Creates a new Event instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Event instance
                 */
                public static create(properties?: havocai.messages.v0.IEvent): havocai.messages.v0.Event;

                /**
                 * Encodes the specified Event message. Does not implicitly {@link havocai.messages.v0.Event.verify|verify} messages.
                 * @param message Event message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IEvent, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Event message, length delimited. Does not implicitly {@link havocai.messages.v0.Event.verify|verify} messages.
                 * @param message Event message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IEvent, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Event message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Event
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Event;

                /**
                 * Decodes an Event message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Event
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Event;

                /**
                 * Verifies an Event message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Event message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Event
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Event;

                /**
                 * Creates a plain object from an Event message. Also converts values to other types if specified.
                 * @param message Event
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Event, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Event to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Event
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of an EventList. */
            interface IEventList {

                /** EventList values */
                values?: (havocai.messages.v0.IEvent[]|null);
            }

            /** Represents an EventList. */
            class EventList implements IEventList {

                /**
                 * Constructs a new EventList.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IEventList);

                /** EventList values. */
                public values: havocai.messages.v0.IEvent[];

                /**
                 * Creates a new EventList instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns EventList instance
                 */
                public static create(properties?: havocai.messages.v0.IEventList): havocai.messages.v0.EventList;

                /**
                 * Encodes the specified EventList message. Does not implicitly {@link havocai.messages.v0.EventList.verify|verify} messages.
                 * @param message EventList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IEventList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified EventList message, length delimited. Does not implicitly {@link havocai.messages.v0.EventList.verify|verify} messages.
                 * @param message EventList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IEventList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an EventList message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns EventList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.EventList;

                /**
                 * Decodes an EventList message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns EventList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.EventList;

                /**
                 * Verifies an EventList message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an EventList message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns EventList
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.EventList;

                /**
                 * Creates a plain object from an EventList message. Also converts values to other types if specified.
                 * @param message EventList
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.EventList, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this EventList to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for EventList
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a PlayDefinition. */
            interface IPlayDefinition {

                /** PlayDefinition meta */
                meta?: (havocai.messages.v0.IMetadata|null);

                /** PlayDefinition spec */
                spec?: (havocai.messages.v0.IPlayDefinitionSpec|null);
            }

            /** Represents a PlayDefinition. */
            class PlayDefinition implements IPlayDefinition {

                /**
                 * Constructs a new PlayDefinition.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IPlayDefinition);

                /** PlayDefinition meta. */
                public meta?: (havocai.messages.v0.IMetadata|null);

                /** PlayDefinition spec. */
                public spec?: (havocai.messages.v0.IPlayDefinitionSpec|null);

                /**
                 * Creates a new PlayDefinition instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PlayDefinition instance
                 */
                public static create(properties?: havocai.messages.v0.IPlayDefinition): havocai.messages.v0.PlayDefinition;

                /**
                 * Encodes the specified PlayDefinition message. Does not implicitly {@link havocai.messages.v0.PlayDefinition.verify|verify} messages.
                 * @param message PlayDefinition message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IPlayDefinition, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PlayDefinition message, length delimited. Does not implicitly {@link havocai.messages.v0.PlayDefinition.verify|verify} messages.
                 * @param message PlayDefinition message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IPlayDefinition, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PlayDefinition message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PlayDefinition
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.PlayDefinition;

                /**
                 * Decodes a PlayDefinition message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PlayDefinition
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.PlayDefinition;

                /**
                 * Verifies a PlayDefinition message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PlayDefinition message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PlayDefinition
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.PlayDefinition;

                /**
                 * Creates a plain object from a PlayDefinition message. Also converts values to other types if specified.
                 * @param message PlayDefinition
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.PlayDefinition, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PlayDefinition to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for PlayDefinition
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a PlayDefinitionList. */
            interface IPlayDefinitionList {

                /** PlayDefinitionList values */
                values?: (havocai.messages.v0.IPlayDefinition[]|null);
            }

            /** Represents a PlayDefinitionList. */
            class PlayDefinitionList implements IPlayDefinitionList {

                /**
                 * Constructs a new PlayDefinitionList.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IPlayDefinitionList);

                /** PlayDefinitionList values. */
                public values: havocai.messages.v0.IPlayDefinition[];

                /**
                 * Creates a new PlayDefinitionList instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PlayDefinitionList instance
                 */
                public static create(properties?: havocai.messages.v0.IPlayDefinitionList): havocai.messages.v0.PlayDefinitionList;

                /**
                 * Encodes the specified PlayDefinitionList message. Does not implicitly {@link havocai.messages.v0.PlayDefinitionList.verify|verify} messages.
                 * @param message PlayDefinitionList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IPlayDefinitionList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PlayDefinitionList message, length delimited. Does not implicitly {@link havocai.messages.v0.PlayDefinitionList.verify|verify} messages.
                 * @param message PlayDefinitionList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IPlayDefinitionList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PlayDefinitionList message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PlayDefinitionList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.PlayDefinitionList;

                /**
                 * Decodes a PlayDefinitionList message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PlayDefinitionList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.PlayDefinitionList;

                /**
                 * Verifies a PlayDefinitionList message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PlayDefinitionList message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PlayDefinitionList
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.PlayDefinitionList;

                /**
                 * Creates a plain object from a PlayDefinitionList message. Also converts values to other types if specified.
                 * @param message PlayDefinitionList
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.PlayDefinitionList, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PlayDefinitionList to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for PlayDefinitionList
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a PlayExecution. */
            interface IPlayExecution {

                /** PlayExecution meta */
                meta?: (havocai.messages.v0.IMetadata|null);

                /** PlayExecution spec */
                spec?: (havocai.messages.v0.IPlayExecutionSpec|null);

                /** PlayExecution status */
                status?: (havocai.messages.v0.IPlayExecutionStatus|null);
            }

            /** Represents a PlayExecution. */
            class PlayExecution implements IPlayExecution {

                /**
                 * Constructs a new PlayExecution.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IPlayExecution);

                /** PlayExecution meta. */
                public meta?: (havocai.messages.v0.IMetadata|null);

                /** PlayExecution spec. */
                public spec?: (havocai.messages.v0.IPlayExecutionSpec|null);

                /** PlayExecution status. */
                public status?: (havocai.messages.v0.IPlayExecutionStatus|null);

                /**
                 * Creates a new PlayExecution instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PlayExecution instance
                 */
                public static create(properties?: havocai.messages.v0.IPlayExecution): havocai.messages.v0.PlayExecution;

                /**
                 * Encodes the specified PlayExecution message. Does not implicitly {@link havocai.messages.v0.PlayExecution.verify|verify} messages.
                 * @param message PlayExecution message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IPlayExecution, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PlayExecution message, length delimited. Does not implicitly {@link havocai.messages.v0.PlayExecution.verify|verify} messages.
                 * @param message PlayExecution message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IPlayExecution, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PlayExecution message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PlayExecution
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.PlayExecution;

                /**
                 * Decodes a PlayExecution message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PlayExecution
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.PlayExecution;

                /**
                 * Verifies a PlayExecution message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PlayExecution message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PlayExecution
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.PlayExecution;

                /**
                 * Creates a plain object from a PlayExecution message. Also converts values to other types if specified.
                 * @param message PlayExecution
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.PlayExecution, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PlayExecution to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for PlayExecution
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a PlayExecutionSpec. */
            interface IPlayExecutionSpec {

                /** PlayExecutionSpec playDefinition */
                playDefinition?: (havocai.messages.v0.IResourceRef|null);

                /** PlayExecutionSpec team */
                team?: (havocai.messages.v0.IResourceRef|null);

                /** PlayExecutionSpec tasks */
                tasks?: (havocai.messages.v0.ITaskExecution[]|null);

                /** PlayExecutionSpec avoidanceDistance */
                avoidanceDistance?: (number|null);

                /** PlayExecutionSpec targetState */
                targetState?: (havocai.messages.v0.PlayState|null);
            }

            /** Represents a PlayExecutionSpec. */
            class PlayExecutionSpec implements IPlayExecutionSpec {

                /**
                 * Constructs a new PlayExecutionSpec.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IPlayExecutionSpec);

                /** PlayExecutionSpec playDefinition. */
                public playDefinition?: (havocai.messages.v0.IResourceRef|null);

                /** PlayExecutionSpec team. */
                public team?: (havocai.messages.v0.IResourceRef|null);

                /** PlayExecutionSpec tasks. */
                public tasks: havocai.messages.v0.ITaskExecution[];

                /** PlayExecutionSpec avoidanceDistance. */
                public avoidanceDistance?: (number|null);

                /** PlayExecutionSpec targetState. */
                public targetState: havocai.messages.v0.PlayState;

                /** PlayExecutionSpec _avoidanceDistance. */
                public _avoidanceDistance?: "avoidanceDistance";

                /**
                 * Creates a new PlayExecutionSpec instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PlayExecutionSpec instance
                 */
                public static create(properties?: havocai.messages.v0.IPlayExecutionSpec): havocai.messages.v0.PlayExecutionSpec;

                /**
                 * Encodes the specified PlayExecutionSpec message. Does not implicitly {@link havocai.messages.v0.PlayExecutionSpec.verify|verify} messages.
                 * @param message PlayExecutionSpec message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IPlayExecutionSpec, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PlayExecutionSpec message, length delimited. Does not implicitly {@link havocai.messages.v0.PlayExecutionSpec.verify|verify} messages.
                 * @param message PlayExecutionSpec message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IPlayExecutionSpec, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PlayExecutionSpec message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PlayExecutionSpec
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.PlayExecutionSpec;

                /**
                 * Decodes a PlayExecutionSpec message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PlayExecutionSpec
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.PlayExecutionSpec;

                /**
                 * Verifies a PlayExecutionSpec message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PlayExecutionSpec message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PlayExecutionSpec
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.PlayExecutionSpec;

                /**
                 * Creates a plain object from a PlayExecutionSpec message. Also converts values to other types if specified.
                 * @param message PlayExecutionSpec
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.PlayExecutionSpec, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PlayExecutionSpec to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for PlayExecutionSpec
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a PlayExecutionStatus. */
            interface IPlayExecutionStatus {

                /** PlayExecutionStatus state */
                state?: (havocai.messages.v0.PlayState|null);

                /** PlayExecutionStatus taskStatuses */
                taskStatuses?: (havocai.messages.v0.ITaskExecutionStatus[]|null);
            }

            /** Represents a PlayExecutionStatus. */
            class PlayExecutionStatus implements IPlayExecutionStatus {

                /**
                 * Constructs a new PlayExecutionStatus.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IPlayExecutionStatus);

                /** PlayExecutionStatus state. */
                public state: havocai.messages.v0.PlayState;

                /** PlayExecutionStatus taskStatuses. */
                public taskStatuses: havocai.messages.v0.ITaskExecutionStatus[];

                /**
                 * Creates a new PlayExecutionStatus instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PlayExecutionStatus instance
                 */
                public static create(properties?: havocai.messages.v0.IPlayExecutionStatus): havocai.messages.v0.PlayExecutionStatus;

                /**
                 * Encodes the specified PlayExecutionStatus message. Does not implicitly {@link havocai.messages.v0.PlayExecutionStatus.verify|verify} messages.
                 * @param message PlayExecutionStatus message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IPlayExecutionStatus, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PlayExecutionStatus message, length delimited. Does not implicitly {@link havocai.messages.v0.PlayExecutionStatus.verify|verify} messages.
                 * @param message PlayExecutionStatus message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IPlayExecutionStatus, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PlayExecutionStatus message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PlayExecutionStatus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.PlayExecutionStatus;

                /**
                 * Decodes a PlayExecutionStatus message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PlayExecutionStatus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.PlayExecutionStatus;

                /**
                 * Verifies a PlayExecutionStatus message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PlayExecutionStatus message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PlayExecutionStatus
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.PlayExecutionStatus;

                /**
                 * Creates a plain object from a PlayExecutionStatus message. Also converts values to other types if specified.
                 * @param message PlayExecutionStatus
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.PlayExecutionStatus, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PlayExecutionStatus to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for PlayExecutionStatus
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TaskExecutionStatus. */
            interface ITaskExecutionStatus {

                /** TaskExecutionStatus state */
                state?: (havocai.messages.v0.TaskState|null);

                /** TaskExecutionStatus type */
                type?: (havocai.messages.v0.TaskType|null);

                /** TaskExecutionStatus taskExecutionId */
                taskExecutionId?: (string|null);

                /** TaskExecutionStatus taskDefinitionId */
                taskDefinitionId?: (string|null);

                /** TaskExecutionStatus boatCount */
                boatCount?: (number|null);

                /** TaskExecutionStatus eta */
                eta?: (number|Long|null);

                /** TaskExecutionStatus lastEta */
                lastEta?: (number|Long|null);

                /** TaskExecutionStatus conditionalsPending */
                conditionalsPending?: (string[]|null);

                /** TaskExecutionStatus conditionalsMet */
                conditionalsMet?: (string[]|null);
            }

            /** Represents a TaskExecutionStatus. */
            class TaskExecutionStatus implements ITaskExecutionStatus {

                /**
                 * Constructs a new TaskExecutionStatus.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ITaskExecutionStatus);

                /** TaskExecutionStatus state. */
                public state: havocai.messages.v0.TaskState;

                /** TaskExecutionStatus type. */
                public type: havocai.messages.v0.TaskType;

                /** TaskExecutionStatus taskExecutionId. */
                public taskExecutionId: string;

                /** TaskExecutionStatus taskDefinitionId. */
                public taskDefinitionId: string;

                /** TaskExecutionStatus boatCount. */
                public boatCount: number;

                /** TaskExecutionStatus eta. */
                public eta: (number|Long);

                /** TaskExecutionStatus lastEta. */
                public lastEta: (number|Long);

                /** TaskExecutionStatus conditionalsPending. */
                public conditionalsPending: string[];

                /** TaskExecutionStatus conditionalsMet. */
                public conditionalsMet: string[];

                /**
                 * Creates a new TaskExecutionStatus instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TaskExecutionStatus instance
                 */
                public static create(properties?: havocai.messages.v0.ITaskExecutionStatus): havocai.messages.v0.TaskExecutionStatus;

                /**
                 * Encodes the specified TaskExecutionStatus message. Does not implicitly {@link havocai.messages.v0.TaskExecutionStatus.verify|verify} messages.
                 * @param message TaskExecutionStatus message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ITaskExecutionStatus, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TaskExecutionStatus message, length delimited. Does not implicitly {@link havocai.messages.v0.TaskExecutionStatus.verify|verify} messages.
                 * @param message TaskExecutionStatus message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ITaskExecutionStatus, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TaskExecutionStatus message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TaskExecutionStatus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.TaskExecutionStatus;

                /**
                 * Decodes a TaskExecutionStatus message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TaskExecutionStatus
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.TaskExecutionStatus;

                /**
                 * Verifies a TaskExecutionStatus message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TaskExecutionStatus message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TaskExecutionStatus
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.TaskExecutionStatus;

                /**
                 * Creates a plain object from a TaskExecutionStatus message. Also converts values to other types if specified.
                 * @param message TaskExecutionStatus
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.TaskExecutionStatus, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TaskExecutionStatus to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TaskExecutionStatus
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a PlayExecutionList. */
            interface IPlayExecutionList {

                /** PlayExecutionList values */
                values?: (havocai.messages.v0.IPlayExecution[]|null);
            }

            /** Represents a PlayExecutionList. */
            class PlayExecutionList implements IPlayExecutionList {

                /**
                 * Constructs a new PlayExecutionList.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IPlayExecutionList);

                /** PlayExecutionList values. */
                public values: havocai.messages.v0.IPlayExecution[];

                /**
                 * Creates a new PlayExecutionList instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PlayExecutionList instance
                 */
                public static create(properties?: havocai.messages.v0.IPlayExecutionList): havocai.messages.v0.PlayExecutionList;

                /**
                 * Encodes the specified PlayExecutionList message. Does not implicitly {@link havocai.messages.v0.PlayExecutionList.verify|verify} messages.
                 * @param message PlayExecutionList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IPlayExecutionList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PlayExecutionList message, length delimited. Does not implicitly {@link havocai.messages.v0.PlayExecutionList.verify|verify} messages.
                 * @param message PlayExecutionList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IPlayExecutionList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PlayExecutionList message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PlayExecutionList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.PlayExecutionList;

                /**
                 * Decodes a PlayExecutionList message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PlayExecutionList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.PlayExecutionList;

                /**
                 * Verifies a PlayExecutionList message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PlayExecutionList message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PlayExecutionList
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.PlayExecutionList;

                /**
                 * Creates a plain object from a PlayExecutionList message. Also converts values to other types if specified.
                 * @param message PlayExecutionList
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.PlayExecutionList, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PlayExecutionList to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for PlayExecutionList
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a PlayRunner. */
            interface IPlayRunner {

                /** PlayRunner meta */
                meta?: (havocai.messages.v0.IMetadata|null);

                /** PlayRunner spec */
                spec?: (havocai.messages.v0.IPlayRunnerSpec|null);
            }

            /** Represents a PlayRunner. */
            class PlayRunner implements IPlayRunner {

                /**
                 * Constructs a new PlayRunner.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IPlayRunner);

                /** PlayRunner meta. */
                public meta?: (havocai.messages.v0.IMetadata|null);

                /** PlayRunner spec. */
                public spec?: (havocai.messages.v0.IPlayRunnerSpec|null);

                /**
                 * Creates a new PlayRunner instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PlayRunner instance
                 */
                public static create(properties?: havocai.messages.v0.IPlayRunner): havocai.messages.v0.PlayRunner;

                /**
                 * Encodes the specified PlayRunner message. Does not implicitly {@link havocai.messages.v0.PlayRunner.verify|verify} messages.
                 * @param message PlayRunner message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IPlayRunner, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PlayRunner message, length delimited. Does not implicitly {@link havocai.messages.v0.PlayRunner.verify|verify} messages.
                 * @param message PlayRunner message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IPlayRunner, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PlayRunner message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PlayRunner
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.PlayRunner;

                /**
                 * Decodes a PlayRunner message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PlayRunner
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.PlayRunner;

                /**
                 * Verifies a PlayRunner message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PlayRunner message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PlayRunner
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.PlayRunner;

                /**
                 * Creates a plain object from a PlayRunner message. Also converts values to other types if specified.
                 * @param message PlayRunner
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.PlayRunner, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PlayRunner to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for PlayRunner
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a PlayRunnerSpec. */
            interface IPlayRunnerSpec {

                /** PlayRunnerSpec playExecution */
                playExecution?: (havocai.messages.v0.IResourceRef|null);
            }

            /** Represents a PlayRunnerSpec. */
            class PlayRunnerSpec implements IPlayRunnerSpec {

                /**
                 * Constructs a new PlayRunnerSpec.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IPlayRunnerSpec);

                /** PlayRunnerSpec playExecution. */
                public playExecution?: (havocai.messages.v0.IResourceRef|null);

                /**
                 * Creates a new PlayRunnerSpec instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PlayRunnerSpec instance
                 */
                public static create(properties?: havocai.messages.v0.IPlayRunnerSpec): havocai.messages.v0.PlayRunnerSpec;

                /**
                 * Encodes the specified PlayRunnerSpec message. Does not implicitly {@link havocai.messages.v0.PlayRunnerSpec.verify|verify} messages.
                 * @param message PlayRunnerSpec message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IPlayRunnerSpec, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PlayRunnerSpec message, length delimited. Does not implicitly {@link havocai.messages.v0.PlayRunnerSpec.verify|verify} messages.
                 * @param message PlayRunnerSpec message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IPlayRunnerSpec, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PlayRunnerSpec message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PlayRunnerSpec
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.PlayRunnerSpec;

                /**
                 * Decodes a PlayRunnerSpec message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PlayRunnerSpec
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.PlayRunnerSpec;

                /**
                 * Verifies a PlayRunnerSpec message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PlayRunnerSpec message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PlayRunnerSpec
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.PlayRunnerSpec;

                /**
                 * Creates a plain object from a PlayRunnerSpec message. Also converts values to other types if specified.
                 * @param message PlayRunnerSpec
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.PlayRunnerSpec, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PlayRunnerSpec to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for PlayRunnerSpec
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a PlayRunnerList. */
            interface IPlayRunnerList {

                /** PlayRunnerList values */
                values?: (havocai.messages.v0.IPlayRunner[]|null);
            }

            /** Represents a PlayRunnerList. */
            class PlayRunnerList implements IPlayRunnerList {

                /**
                 * Constructs a new PlayRunnerList.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IPlayRunnerList);

                /** PlayRunnerList values. */
                public values: havocai.messages.v0.IPlayRunner[];

                /**
                 * Creates a new PlayRunnerList instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PlayRunnerList instance
                 */
                public static create(properties?: havocai.messages.v0.IPlayRunnerList): havocai.messages.v0.PlayRunnerList;

                /**
                 * Encodes the specified PlayRunnerList message. Does not implicitly {@link havocai.messages.v0.PlayRunnerList.verify|verify} messages.
                 * @param message PlayRunnerList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IPlayRunnerList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PlayRunnerList message, length delimited. Does not implicitly {@link havocai.messages.v0.PlayRunnerList.verify|verify} messages.
                 * @param message PlayRunnerList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IPlayRunnerList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PlayRunnerList message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PlayRunnerList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.PlayRunnerList;

                /**
                 * Decodes a PlayRunnerList message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PlayRunnerList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.PlayRunnerList;

                /**
                 * Verifies a PlayRunnerList message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PlayRunnerList message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PlayRunnerList
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.PlayRunnerList;

                /**
                 * Creates a plain object from a PlayRunnerList message. Also converts values to other types if specified.
                 * @param message PlayRunnerList
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.PlayRunnerList, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PlayRunnerList to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for PlayRunnerList
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a Simulation. */
            interface ISimulation {

                /** Simulation meta */
                meta?: (havocai.messages.v0.IMetadata|null);

                /** Simulation spec */
                spec?: (havocai.messages.v0.ISimulationSpec|null);
            }

            /** Represents a Simulation. */
            class Simulation implements ISimulation {

                /**
                 * Constructs a new Simulation.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ISimulation);

                /** Simulation meta. */
                public meta?: (havocai.messages.v0.IMetadata|null);

                /** Simulation spec. */
                public spec?: (havocai.messages.v0.ISimulationSpec|null);

                /**
                 * Creates a new Simulation instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Simulation instance
                 */
                public static create(properties?: havocai.messages.v0.ISimulation): havocai.messages.v0.Simulation;

                /**
                 * Encodes the specified Simulation message. Does not implicitly {@link havocai.messages.v0.Simulation.verify|verify} messages.
                 * @param message Simulation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ISimulation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Simulation message, length delimited. Does not implicitly {@link havocai.messages.v0.Simulation.verify|verify} messages.
                 * @param message Simulation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ISimulation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Simulation message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Simulation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.Simulation;

                /**
                 * Decodes a Simulation message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Simulation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.Simulation;

                /**
                 * Verifies a Simulation message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Simulation message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Simulation
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.Simulation;

                /**
                 * Creates a plain object from a Simulation message. Also converts values to other types if specified.
                 * @param message Simulation
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.Simulation, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Simulation to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Simulation
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a SimulationSpec. */
            interface ISimulationSpec {

                /** SimulationSpec multiplier */
                multiplier?: (number|null);

                /** SimulationSpec tracks */
                tracks?: (havocai.messages.v0.ITrackSimulation[]|null);
            }

            /** Represents a SimulationSpec. */
            class SimulationSpec implements ISimulationSpec {

                /**
                 * Constructs a new SimulationSpec.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ISimulationSpec);

                /** SimulationSpec multiplier. */
                public multiplier: number;

                /** SimulationSpec tracks. */
                public tracks: havocai.messages.v0.ITrackSimulation[];

                /**
                 * Creates a new SimulationSpec instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SimulationSpec instance
                 */
                public static create(properties?: havocai.messages.v0.ISimulationSpec): havocai.messages.v0.SimulationSpec;

                /**
                 * Encodes the specified SimulationSpec message. Does not implicitly {@link havocai.messages.v0.SimulationSpec.verify|verify} messages.
                 * @param message SimulationSpec message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ISimulationSpec, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SimulationSpec message, length delimited. Does not implicitly {@link havocai.messages.v0.SimulationSpec.verify|verify} messages.
                 * @param message SimulationSpec message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ISimulationSpec, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SimulationSpec message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SimulationSpec
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.SimulationSpec;

                /**
                 * Decodes a SimulationSpec message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SimulationSpec
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.SimulationSpec;

                /**
                 * Verifies a SimulationSpec message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SimulationSpec message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SimulationSpec
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.SimulationSpec;

                /**
                 * Creates a plain object from a SimulationSpec message. Also converts values to other types if specified.
                 * @param message SimulationSpec
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.SimulationSpec, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SimulationSpec to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for SimulationSpec
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a TrackSimulation. */
            interface ITrackSimulation {

                /** TrackSimulation type */
                type?: (havocai.messages.v0.TrackType|null);

                /** TrackSimulation affiliation */
                affiliation?: (havocai.messages.v0.Affiliation|null);

                /** TrackSimulation speed */
                speed?: (number|null);

                /** TrackSimulation semiRandom */
                semiRandom?: (havocai.messages.v0.ISemiRandomRouting|null);

                /** TrackSimulation straightLine */
                straightLine?: (havocai.messages.v0.IStraightLineRouting|null);
            }

            /** Represents a TrackSimulation. */
            class TrackSimulation implements ITrackSimulation {

                /**
                 * Constructs a new TrackSimulation.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ITrackSimulation);

                /** TrackSimulation type. */
                public type: havocai.messages.v0.TrackType;

                /** TrackSimulation affiliation. */
                public affiliation: havocai.messages.v0.Affiliation;

                /** TrackSimulation speed. */
                public speed: number;

                /** TrackSimulation semiRandom. */
                public semiRandom?: (havocai.messages.v0.ISemiRandomRouting|null);

                /** TrackSimulation straightLine. */
                public straightLine?: (havocai.messages.v0.IStraightLineRouting|null);

                /** TrackSimulation routingType. */
                public routingType?: ("semiRandom"|"straightLine");

                /**
                 * Creates a new TrackSimulation instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TrackSimulation instance
                 */
                public static create(properties?: havocai.messages.v0.ITrackSimulation): havocai.messages.v0.TrackSimulation;

                /**
                 * Encodes the specified TrackSimulation message. Does not implicitly {@link havocai.messages.v0.TrackSimulation.verify|verify} messages.
                 * @param message TrackSimulation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ITrackSimulation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TrackSimulation message, length delimited. Does not implicitly {@link havocai.messages.v0.TrackSimulation.verify|verify} messages.
                 * @param message TrackSimulation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ITrackSimulation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TrackSimulation message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TrackSimulation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.TrackSimulation;

                /**
                 * Decodes a TrackSimulation message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TrackSimulation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.TrackSimulation;

                /**
                 * Verifies a TrackSimulation message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TrackSimulation message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TrackSimulation
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.TrackSimulation;

                /**
                 * Creates a plain object from a TrackSimulation message. Also converts values to other types if specified.
                 * @param message TrackSimulation
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.TrackSimulation, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TrackSimulation to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for TrackSimulation
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a SemiRandomRouting. */
            interface ISemiRandomRouting {

                /** SemiRandomRouting trackNamePrefix */
                trackNamePrefix?: (string|null);

                /** SemiRandomRouting count */
                count?: (number|null);

                /** SemiRandomRouting area */
                area?: (havocai.messages.v0.IGeoPoint[]|null);

                /** SemiRandomRouting maxHeadingVariation */
                maxHeadingVariation?: (number|null);

                /** SemiRandomRouting headingUpdateInterval */
                headingUpdateInterval?: (number|null);
            }

            /** Represents a SemiRandomRouting. */
            class SemiRandomRouting implements ISemiRandomRouting {

                /**
                 * Constructs a new SemiRandomRouting.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ISemiRandomRouting);

                /** SemiRandomRouting trackNamePrefix. */
                public trackNamePrefix: string;

                /** SemiRandomRouting count. */
                public count: number;

                /** SemiRandomRouting area. */
                public area: havocai.messages.v0.IGeoPoint[];

                /** SemiRandomRouting maxHeadingVariation. */
                public maxHeadingVariation: number;

                /** SemiRandomRouting headingUpdateInterval. */
                public headingUpdateInterval: number;

                /**
                 * Creates a new SemiRandomRouting instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SemiRandomRouting instance
                 */
                public static create(properties?: havocai.messages.v0.ISemiRandomRouting): havocai.messages.v0.SemiRandomRouting;

                /**
                 * Encodes the specified SemiRandomRouting message. Does not implicitly {@link havocai.messages.v0.SemiRandomRouting.verify|verify} messages.
                 * @param message SemiRandomRouting message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ISemiRandomRouting, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SemiRandomRouting message, length delimited. Does not implicitly {@link havocai.messages.v0.SemiRandomRouting.verify|verify} messages.
                 * @param message SemiRandomRouting message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ISemiRandomRouting, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SemiRandomRouting message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SemiRandomRouting
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.SemiRandomRouting;

                /**
                 * Decodes a SemiRandomRouting message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SemiRandomRouting
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.SemiRandomRouting;

                /**
                 * Verifies a SemiRandomRouting message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SemiRandomRouting message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SemiRandomRouting
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.SemiRandomRouting;

                /**
                 * Creates a plain object from a SemiRandomRouting message. Also converts values to other types if specified.
                 * @param message SemiRandomRouting
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.SemiRandomRouting, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SemiRandomRouting to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for SemiRandomRouting
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a StraightLineRouting. */
            interface IStraightLineRouting {

                /** StraightLineRouting trackId */
                trackId?: (string|null);

                /** StraightLineRouting trackName */
                trackName?: (string|null);

                /** StraightLineRouting startEnd */
                startEnd?: (havocai.messages.v0.IStartEndPoint|null);

                /** StraightLineRouting startArea */
                startArea?: (havocai.messages.v0.IStartPointEndArea|null);

                /** StraightLineRouting startHeading */
                startHeading?: (havocai.messages.v0.IStartPointHeading|null);
            }

            /** Represents a StraightLineRouting. */
            class StraightLineRouting implements IStraightLineRouting {

                /**
                 * Constructs a new StraightLineRouting.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IStraightLineRouting);

                /** StraightLineRouting trackId. */
                public trackId: string;

                /** StraightLineRouting trackName. */
                public trackName: string;

                /** StraightLineRouting startEnd. */
                public startEnd?: (havocai.messages.v0.IStartEndPoint|null);

                /** StraightLineRouting startArea. */
                public startArea?: (havocai.messages.v0.IStartPointEndArea|null);

                /** StraightLineRouting startHeading. */
                public startHeading?: (havocai.messages.v0.IStartPointHeading|null);

                /** StraightLineRouting movement. */
                public movement?: ("startEnd"|"startArea"|"startHeading");

                /**
                 * Creates a new StraightLineRouting instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns StraightLineRouting instance
                 */
                public static create(properties?: havocai.messages.v0.IStraightLineRouting): havocai.messages.v0.StraightLineRouting;

                /**
                 * Encodes the specified StraightLineRouting message. Does not implicitly {@link havocai.messages.v0.StraightLineRouting.verify|verify} messages.
                 * @param message StraightLineRouting message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IStraightLineRouting, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified StraightLineRouting message, length delimited. Does not implicitly {@link havocai.messages.v0.StraightLineRouting.verify|verify} messages.
                 * @param message StraightLineRouting message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IStraightLineRouting, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a StraightLineRouting message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns StraightLineRouting
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.StraightLineRouting;

                /**
                 * Decodes a StraightLineRouting message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns StraightLineRouting
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.StraightLineRouting;

                /**
                 * Verifies a StraightLineRouting message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a StraightLineRouting message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns StraightLineRouting
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.StraightLineRouting;

                /**
                 * Creates a plain object from a StraightLineRouting message. Also converts values to other types if specified.
                 * @param message StraightLineRouting
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.StraightLineRouting, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this StraightLineRouting to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for StraightLineRouting
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a StartEndPoint. */
            interface IStartEndPoint {

                /** StartEndPoint startPoint */
                startPoint?: (havocai.messages.v0.IGeoPoint|null);

                /** StartEndPoint endPoint */
                endPoint?: (havocai.messages.v0.IGeoPoint|null);
            }

            /** Represents a StartEndPoint. */
            class StartEndPoint implements IStartEndPoint {

                /**
                 * Constructs a new StartEndPoint.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IStartEndPoint);

                /** StartEndPoint startPoint. */
                public startPoint?: (havocai.messages.v0.IGeoPoint|null);

                /** StartEndPoint endPoint. */
                public endPoint?: (havocai.messages.v0.IGeoPoint|null);

                /**
                 * Creates a new StartEndPoint instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns StartEndPoint instance
                 */
                public static create(properties?: havocai.messages.v0.IStartEndPoint): havocai.messages.v0.StartEndPoint;

                /**
                 * Encodes the specified StartEndPoint message. Does not implicitly {@link havocai.messages.v0.StartEndPoint.verify|verify} messages.
                 * @param message StartEndPoint message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IStartEndPoint, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified StartEndPoint message, length delimited. Does not implicitly {@link havocai.messages.v0.StartEndPoint.verify|verify} messages.
                 * @param message StartEndPoint message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IStartEndPoint, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a StartEndPoint message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns StartEndPoint
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.StartEndPoint;

                /**
                 * Decodes a StartEndPoint message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns StartEndPoint
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.StartEndPoint;

                /**
                 * Verifies a StartEndPoint message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a StartEndPoint message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns StartEndPoint
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.StartEndPoint;

                /**
                 * Creates a plain object from a StartEndPoint message. Also converts values to other types if specified.
                 * @param message StartEndPoint
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.StartEndPoint, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this StartEndPoint to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for StartEndPoint
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a StartPointEndArea. */
            interface IStartPointEndArea {

                /** StartPointEndArea startPoint */
                startPoint?: (havocai.messages.v0.IGeoPoint|null);

                /** StartPointEndArea area */
                area?: (havocai.messages.v0.IGeoPoint[]|null);
            }

            /** Represents a StartPointEndArea. */
            class StartPointEndArea implements IStartPointEndArea {

                /**
                 * Constructs a new StartPointEndArea.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IStartPointEndArea);

                /** StartPointEndArea startPoint. */
                public startPoint?: (havocai.messages.v0.IGeoPoint|null);

                /** StartPointEndArea area. */
                public area: havocai.messages.v0.IGeoPoint[];

                /**
                 * Creates a new StartPointEndArea instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns StartPointEndArea instance
                 */
                public static create(properties?: havocai.messages.v0.IStartPointEndArea): havocai.messages.v0.StartPointEndArea;

                /**
                 * Encodes the specified StartPointEndArea message. Does not implicitly {@link havocai.messages.v0.StartPointEndArea.verify|verify} messages.
                 * @param message StartPointEndArea message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IStartPointEndArea, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified StartPointEndArea message, length delimited. Does not implicitly {@link havocai.messages.v0.StartPointEndArea.verify|verify} messages.
                 * @param message StartPointEndArea message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IStartPointEndArea, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a StartPointEndArea message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns StartPointEndArea
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.StartPointEndArea;

                /**
                 * Decodes a StartPointEndArea message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns StartPointEndArea
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.StartPointEndArea;

                /**
                 * Verifies a StartPointEndArea message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a StartPointEndArea message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns StartPointEndArea
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.StartPointEndArea;

                /**
                 * Creates a plain object from a StartPointEndArea message. Also converts values to other types if specified.
                 * @param message StartPointEndArea
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.StartPointEndArea, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this StartPointEndArea to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for StartPointEndArea
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a StartPointHeading. */
            interface IStartPointHeading {

                /** StartPointHeading startPoint */
                startPoint?: (havocai.messages.v0.IGeoPoint|null);

                /** StartPointHeading heading */
                heading?: (number|null);

                /** StartPointHeading distance */
                distance?: (number|null);
            }

            /** Represents a StartPointHeading. */
            class StartPointHeading implements IStartPointHeading {

                /**
                 * Constructs a new StartPointHeading.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.IStartPointHeading);

                /** StartPointHeading startPoint. */
                public startPoint?: (havocai.messages.v0.IGeoPoint|null);

                /** StartPointHeading heading. */
                public heading: number;

                /** StartPointHeading distance. */
                public distance: number;

                /**
                 * Creates a new StartPointHeading instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns StartPointHeading instance
                 */
                public static create(properties?: havocai.messages.v0.IStartPointHeading): havocai.messages.v0.StartPointHeading;

                /**
                 * Encodes the specified StartPointHeading message. Does not implicitly {@link havocai.messages.v0.StartPointHeading.verify|verify} messages.
                 * @param message StartPointHeading message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.IStartPointHeading, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified StartPointHeading message, length delimited. Does not implicitly {@link havocai.messages.v0.StartPointHeading.verify|verify} messages.
                 * @param message StartPointHeading message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.IStartPointHeading, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a StartPointHeading message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns StartPointHeading
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.StartPointHeading;

                /**
                 * Decodes a StartPointHeading message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns StartPointHeading
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.StartPointHeading;

                /**
                 * Verifies a StartPointHeading message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a StartPointHeading message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns StartPointHeading
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.StartPointHeading;

                /**
                 * Creates a plain object from a StartPointHeading message. Also converts values to other types if specified.
                 * @param message StartPointHeading
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.StartPointHeading, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this StartPointHeading to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for StartPointHeading
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            /** Properties of a SimulationList. */
            interface ISimulationList {

                /** SimulationList values */
                values?: (havocai.messages.v0.ISimulation[]|null);
            }

            /** Represents a SimulationList. */
            class SimulationList implements ISimulationList {

                /**
                 * Constructs a new SimulationList.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: havocai.messages.v0.ISimulationList);

                /** SimulationList values. */
                public values: havocai.messages.v0.ISimulation[];

                /**
                 * Creates a new SimulationList instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SimulationList instance
                 */
                public static create(properties?: havocai.messages.v0.ISimulationList): havocai.messages.v0.SimulationList;

                /**
                 * Encodes the specified SimulationList message. Does not implicitly {@link havocai.messages.v0.SimulationList.verify|verify} messages.
                 * @param message SimulationList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: havocai.messages.v0.ISimulationList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SimulationList message, length delimited. Does not implicitly {@link havocai.messages.v0.SimulationList.verify|verify} messages.
                 * @param message SimulationList message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: havocai.messages.v0.ISimulationList, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SimulationList message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SimulationList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): havocai.messages.v0.SimulationList;

                /**
                 * Decodes a SimulationList message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SimulationList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): havocai.messages.v0.SimulationList;

                /**
                 * Verifies a SimulationList message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SimulationList message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SimulationList
                 */
                public static fromObject(object: { [k: string]: any }): havocai.messages.v0.SimulationList;

                /**
                 * Creates a plain object from a SimulationList message. Also converts values to other types if specified.
                 * @param message SimulationList
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: havocai.messages.v0.SimulationList, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SimulationList to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for SimulationList
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a Timestamp. */
        interface ITimestamp {

            /** Timestamp seconds */
            seconds?: (number|Long|null);

            /** Timestamp nanos */
            nanos?: (number|null);
        }

        /** Represents a Timestamp. */
        class Timestamp implements ITimestamp {

            /**
             * Constructs a new Timestamp.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.ITimestamp);

            /** Timestamp seconds. */
            public seconds: (number|Long);

            /** Timestamp nanos. */
            public nanos: number;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Timestamp instance
             */
            public static create(properties?: google.protobuf.ITimestamp): google.protobuf.Timestamp;

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Timestamp;

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Timestamp;

            /**
             * Verifies a Timestamp message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Timestamp
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Timestamp;

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @param message Timestamp
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Timestamp, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Timestamp to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Timestamp
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
