import pandas as pd
import io


def get_nasa_data_as_dataframe(list_of_csvs: list[str]) -> pd.DataFrame | None:
    """
    Processes a list of NASA POWER project CSV strings, cleans them, and
    returns a single pandas DataFrame.

    Args:
        list_of_csvs: A list of strings, where each string is the content of a
                      CSV file from the NASA POWER project.

    Returns:
        A pandas DataFrame containing the combined and cleaned data from all
        CSVs, or None if no valid data could be parsed.
    """
    if not list_of_csvs:
        print("Warning: The list of NASA CSVs is empty.")
        return None

    list_of_dfs = []
    for i, csv_text in enumerate(list_of_csvs):
        try:
            # The actual data starts after the "-END HEADER-" line
            header_end_str = "-END HEADER-"
            header_end_pos = csv_text.find(header_end_str)

            if header_end_pos != -1:
                # Extract the data portion of the CSV
                data_text = csv_text[header_end_pos + len(header_end_str):].lstrip()
                if data_text:
                    csv_data_io = io.StringIO(data_text)
                    df = pd.read_csv(csv_data_io)
                    # NASA uses -999 for missing values
                    df.replace(-999, pd.NA, inplace=True)
                    list_of_dfs.append(df)
        except Exception as e:
            print(f"Error processing CSV #{i + 1}: {e}")

    if not list_of_dfs:
        print("Warning: No valid data was found in the NASA files after processing.")
        return None

    # Concatenate all dataframes and drop rows with any missing values
    df_full = pd.concat(list_of_dfs, ignore_index=True).dropna()

    # Rename columns to be more user-friendly
    rename_map = {
        'T2M_MAX': 'temp_max',
        'T2M_MIN': 'temp_min',
        'PRECTOTCORR': 'precipitation',
        'WS2M': 'wind_speed'
    }
    df_full.rename(columns=rename_map, inplace=True)

    print(df_full)
    return df_full