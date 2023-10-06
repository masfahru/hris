import { FormatRegistry } from "@sinclair/typebox";
import {
	IsDate,
	IsDateTime,
	IsEmail,
	IsIPv4,
	IsIPv6,
	IsTime,
	IsUrl,
	IsUuid,
} from "./formats/index";

export const initFormatRegistry = () => {
	// Email
	FormatRegistry.Set("email", IsEmail);

	// Date
	FormatRegistry.Set("date", IsDate);

	// Time
	FormatRegistry.Set("time", IsTime);

	// DateTime
	FormatRegistry.Set("date-time", IsDateTime);

	// IPv4
	FormatRegistry.Set("ipv4", IsIPv4);

	// IPv6
	FormatRegistry.Set("ipv6", IsIPv6);

	// URL
	FormatRegistry.Set("uri", IsUrl);

	// UUID
	FormatRegistry.Set("uuid", IsUuid);

	// Check if All Formats are registered
	// Increment manually 😅
	if (FormatRegistry.Entries().size !== 8) {
		throw new Error("Some Formats are not registered");
	}
};
