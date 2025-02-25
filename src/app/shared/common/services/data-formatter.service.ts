import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';

@Injectable({
    providedIn: "root"
})
export class DataFormatterService {

    formatDate(dateString?: string | Date): string {
        if (!dateString) {
            return "N/A"; 
        }

        try {
            const date = new Date(dateString);
            return formatDate(date, "yyyy-MM-dd HH:mm:ss", "en-US") ?? "N/A";
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid Date";
        }
    }
}