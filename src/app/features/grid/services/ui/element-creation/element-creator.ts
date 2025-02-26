import { UIItem } from "../../../../../shared/common/types/Navigation";

export interface GridElementCreator<TCreateDto, TCreatedData> {
    createDto: TCreateDto;
    isReady: boolean;
    typeOptions?: UIItem[];

    handleTempElementAdded(tempElement: TCreatedData): void;
    handleConfirmAddElement(): void;
    handleCancelAddElement(): void;
    handleOptionSelected?(value: string): void;
}