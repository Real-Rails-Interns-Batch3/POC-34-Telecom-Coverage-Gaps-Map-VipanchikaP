require 'csv'

puts "Cleaning out old data..."
Region.destroy_all rescue nil

puts "Reading sample data file from public folder..."
csv_text = File.read(Rails.root.join('public', 'telecom-data (1).csv'))
csv = CSV.parse(csv_text, headers: true)

csv.each do |row|
  Region.create!(
    name: row['Region'],
    latitude: row['Latitude'].to_f,
    longitude: row['Longitude'].to_f,
    coverage: row['Coverage'],
    gap: row['Gap'].to_i
  )
end

puts "Done! Added #{Region.count rescue 0} markers to the database."
