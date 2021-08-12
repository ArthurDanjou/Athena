import {DateTime} from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne} from '@ioc:Adonis/Lucid/Orm'
import File from "App/Models/File";
import Translation from "App/Models/Translation";

export default class Announce extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public color: string

  @column()
  public hoverColor: string

  @belongsTo(() => Translation)
  public message: BelongsTo<typeof Translation>

  @column({ columnName: 'message_id' })
  public messageId: number

  @hasOne(() => File)
  public cover: HasOne<typeof File>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
