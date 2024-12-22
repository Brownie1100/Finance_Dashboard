package com.financedashboard.financedashboard;

import org.hibernate.dialect.Dialect;
import org.hibernate.type.StandardBasicTypes;
import java.sql.Types;

public class CustomSQLiteDialect  extends SQLiteDialect  {
    public CustomSQLiteDialect() {
        super();
        registerColumnType(Types.BIT, "boolean");
        registerColumnType(Types.TINYINT, "tinyint");
        registerColumnType(Types.SMALLINT, "smallint");
        registerColumnType(Types.INTEGER, "integer");
        registerColumnType(Types.BIGINT, "bigint");
        registerColumnType(Types.REAL, "real");
        registerColumnType(Types.DOUBLE, "double");
        registerColumnType(Types.FLOAT, "float");
        registerColumnType(Types.VARCHAR, "varchar");
        registerColumnType(Types.DATE, "date");
        registerColumnType(Types.TIMESTAMP, "datetime");
    }

    @Override
    public boolean hasAlterTable() {
        return false;
    }

    @Override
    public boolean dropConstraints() {
        return false;
    }
}

